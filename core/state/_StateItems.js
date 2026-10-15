// SillyTavern-Horae/core/state/_StateItems.js
/**
 * Подсистема состояния: предметы.
 *
 * Обрабатывает добавление, обновление и удаление предметов
 * по метаданным одного сообщения.
 * Изменяет state.items на месте, сохраняя существующие правила
 * нормализации названий, объединения записей и удаления предметов.
 *
 * TECHNICAL DEBT:
 *     - Вынести парсинг названий (нормализация, определение расхода, извлечение базового имени)
 *       в отдельный ItemParser, чтобы этот модуль работал с уже подготовленными данными,
 *       как и остальные подсистемы состояния
 *     - Метод apply разросся — после выноса парсера станет компактнее
 */

// ===== КЛАСС =====
export class StateItems {
    // ---- ЖИЗНЕННЫЙ ЦИКЛ ----
    /**
     * @param {Object} deps — зависимости
     * @param {Function} deps.getItemBaseName — извлечение базового названия
     * @param {Function} deps.findExistingItemByBaseName — поиск существующего предмета
     * @param {string} deps.countingClassifiers — счётные классификаторы
     */
    constructor({
        getItemBaseName,
        findExistingItemByBaseName,
        countingClassifiers,
    }) {
        this.getItemBaseName = getItemBaseName;
        this.findExistingItemByBaseName = findExistingItemByBaseName;
        this.countingClassifiers = countingClassifiers;
    }

    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения предметов из метаданных сообщения.
     *
     * Предметы с нулевым количеством или признаком расходования
     * удаляются. Защищённые записи (_locked) не обновляют
     * описание, значок и важность.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (meta.items) {
            this._applyItemsUpdates(state, meta.items);
        }

        if (meta.deletedItems && meta.deletedItems.length > 0) {
            this._applyItemsDeletions(state, meta.deletedItems);
        }
    }

    // ---- ВНУТРЕННИЕ МЕТОДЫ ----
    /**
     * Обрабатывает добавление и обновление предметов.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} items — словарь новых/обновлённых предметов
     */
    _applyItemsUpdates(state, items) {
        for (let [name, newInfo] of Object.entries(items)) {
            name = this._normalizeName(name);

            // Нулевое количество означает, что предмет израсходован
            if (this._hasZeroQuantity(name)) {
                this._deleteByBaseName(state, name);
                continue;
            }

            // Признак расходования (китайский / английский)
            if (this._isConsumed(name, newInfo)) {
                const cleanName = this._stripConsumedMarkers(name);
                this._deleteByBaseName(state, cleanName);
                continue;
            }

            // Обновляем или добавляем запись
            this._mergeOrAdd(state, name, newInfo);
        }
    }

    /**
     * Удаляет предметы по списку deletedItems.
     *
     * @param {Object} state — текущее состояние
     * @param {Array} deletedItems — список названий для удаления
     */
    _applyItemsDeletions(state, deletedItems) {
        for (const deletedItem of deletedItems) {
            const deleteBase = this.getItemBaseName(deletedItem).toLowerCase();

            for (const itemName of Object.keys(state.items)) {
                const itemBase = this.getItemBaseName(itemName).toLowerCase();

                if (
                    itemName.toLowerCase() === deletedItem.toLowerCase() ||
                    itemBase === deleteBase
                ) {
                    delete state.items[itemName];
                }
            }
        }
    }

    /**
     * Нормализует название: убирает незначимые обозначения количества, равного единице.
     *
     * ВАЖНО: trim() вызывается после каждого replace() —
     * промежуточный trim может влиять на последующие регулярные выражения.
     *
     * TODO: вынести в ItemParser (см. TECHNICAL DEBT модуля)
     *
     * @param {string} name — исходное название
     * @returns {string} Нормализованное название
     */
    _normalizeName(name) {
        name = name.replace(/[\(（]1[\)）]$/, '').trim();
        name = name.replace(
            new RegExp(`[\\(（]1[${this.countingClassifiers}][\\)）]$`),
            '',
        ).trim();
        name = name.replace(
            new RegExp(`[\\(（][${this.countingClassifiers}][\\)）]$`),
            '',
        ).trim();

        return name;
    }

    /**
     * Проверяет, содержит ли название маркер нулевого количества.
     *
     * TODO: вынести в ItemParser (см. TECHNICAL DEBT модуля)
     *
     * @param {string} name — нормализованное название
     * @returns {boolean}
     */
    _hasZeroQuantity(name) {
        return /[\(（]0[a-zA-Z\u4e00-\u9fff]*[\)）]$/.test(name);
    }

    /**
     * Проверяет, есть ли у предмета признак расходования.
     *
     * TODO: вынести в ItemParser (см. TECHNICAL DEBT модуля)
     *
     * @param {string} name — название предмета
     * @param {Object} newInfo — метаданные предмета
     * @returns {boolean}
     */
    _isConsumed(name, newInfo) {
        const consumedPatterns =
            /[\(（](已消耗|已用完|已销毁|已銷毀|消耗殆尽|消耗殆盡|消耗|用尽|用盡|consumed|used\s*up|destroyed|depleted)[\)）]/i;

        const holderConsumed =
            /^(消耗|已消耗|已用完|消耗殆尽|消耗殆盡|用尽|用盡|无|無|consumed|used\s*up|depleted|none)$/i;

        return (
            consumedPatterns.test(name) ||
            holderConsumed.test(newInfo.holder || '')
        );
    }

    /**
     * Убирает маркеры расходования из названия.
     *
     * TODO: вынести в ItemParser (см. TECHNICAL DEBT модуля)
     *
     * @param {string} name — название с маркерами
     * @returns {string} Очищенное название
     */
    _stripConsumedMarkers(name) {
        const consumedPatterns =
            /[\(（](已消耗|已用完|已销毁|已銷毀|消耗殆尽|消耗殆盡|消耗|用尽|用盡|consumed|used\s*up|destroyed|depleted)[\)）]/i;

        return name.replace(consumedPatterns, '').trim();
    }

    /**
     * Удаляет все предметы, чьё базовое название совпадает с переданным.
     *
     * @param {Object} state — текущее состояние
     * @param {string} name — название для поиска базового имени
     */
    _deleteByBaseName(state, name) {
        const baseName = this.getItemBaseName(name).toLowerCase();

        for (const itemName of Object.keys(state.items)) {
            if (this.getItemBaseName(itemName).toLowerCase() === baseName) {
                delete state.items[itemName];
            }
        }
    }

    /**
     * Объединяет новую запись с существующей или добавляет как новую.
     *
     * @param {Object} state — текущее состояние
     * @param {string} name — нормализованное название
     * @param {Object} newInfo — новые данные предмета
     */
    _mergeOrAdd(state, name, newInfo) {
        const existingKey = this.findExistingItemByBaseName(state.items, name);

        if (!existingKey) {
            state.items[name] = newInfo;
            return;
        }

        const existingItem = state.items[existingKey];
        const locked = !!existingItem._locked;
        const mergedItem = this._mergeItem(existingItem, newInfo, locked);

        // При изменении ключа переносим объединённую запись под новое название
        if (existingKey !== name) {
            delete state.items[existingKey];
        }

        state.items[name] = mergedItem;
    }

    /**
     * Объединяет существующую и новую запись предмета.
     *
     * Защищённые записи (_locked) не обновляют описание, значок и важность.
     * Местонахождение и держатель обновляются всегда.
     *
     * @param {Object} existingItem — существующая запись
     * @param {Object} newInfo — новая запись
     * @param {boolean} locked — защищена ли запись
     * @returns {Object} Объединённая запись
     */
    _mergeItem(existingItem, newInfo, locked) {
        const mergedItem = { ...existingItem };

        if (!locked && newInfo.icon) {
            mergedItem.icon = newInfo.icon;
        }

        if (!locked) {
            mergedItem.importance = this._pickHigherImportance(
                existingItem.importance,
                newInfo.importance,
            );
        }

        // Местонахождение и держатель обновляются даже у защищённых записей
        if (newInfo.holder !== undefined) {
            mergedItem.holder = newInfo.holder;
        }

        if (newInfo.location !== undefined) {
            mergedItem.location = newInfo.location;
        }

        if (
            !locked &&
            newInfo.description !== undefined &&
            newInfo.description.trim()
        ) {
            mergedItem.description = newInfo.description;
        }

        if (!mergedItem.description) {
            mergedItem.description = existingItem.description || '';
        }

        return mergedItem;
    }

    /**
     * Выбирает более высокую важность из двух значений.
     *
     * Шкала: '' < '!' < '!!'.
     *
     * @param {string} oldImportance — старая важность
     * @param {string} newImportance — новая важность
     * @returns {string} Наиболее высокая важность
     */
    _pickHigherImportance(oldImportance, newImportance) {
        const importanceRank = { '': 0, '!': 1, '!!': 2 };
        const newRank = importanceRank[newImportance] ?? 0;
        const oldRank = importanceRank[oldImportance] ?? 0;

        return newRank >= oldRank
            ? (newImportance || '')
            : (oldImportance || '');
    }
}