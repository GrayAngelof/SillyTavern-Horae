/**
 * Обрабатывает добавление, обновление и удаление предметов
 * по метаданным одного сообщения.
 *
 * Изменяет state.items на месте, сохраняя существующие правила
 * нормализации названий, объединения записей и удаления предметов.
 */
export class StateItems {
    constructor({
        getItemBaseName,
        findExistingItemByBaseName,
        countingClassifiers,
    }) {
        this.getItemBaseName = getItemBaseName;
        this.findExistingItemByBaseName = findExistingItemByBaseName;
        this.countingClassifiers = countingClassifiers;
    }

    /**
     * Применяет изменения предметов из метаданных сообщения.
     *
     * Предметы с нулевым количеством или признаком расходования
     * удаляются; защищённые записи (_locked) не обновляют
     * описание, значок и важность.
     */
    apply(state, meta) {
        // Объединяем добавленные и обновлённые предметы.
        if (meta.items) {
            for (let [name, newInfo] of Object.entries(meta.items)) {
                // Убираем незначимые обозначения количества, равного единице.
                name = name.replace(/[\(（]1[\)）]$/, '').trim();
                name = name.replace(
                    new RegExp(`[\\(（]1[${this.countingClassifiers}][\\)）]$`),
                    '',
                ).trim();
                name = name.replace(
                    new RegExp(`[\\(（][${this.countingClassifiers}][\\)）]$`),
                    '',
                ).trim();

                // Нулевое количество означает, что предмет израсходован.
                const zeroMatch = name.match(
                    /[\(（]0[a-zA-Z\u4e00-\u9fff]*[\)）]$/,
                );

                if (zeroMatch) {
                    const baseName = this.getItemBaseName(name);

                    for (const itemName of Object.keys(state.items)) {
                        if (
                            this.getItemBaseName(itemName).toLowerCase() ===
                            baseName.toLowerCase()
                        ) {
                            delete state.items[itemName];
                            console.log(
                                `[Horae] 物品数量归零自动删除: ${itemName}`,
                            );
                        }
                    }

                    continue;
                }

                // Распознаём признаки расходования на китайском и английском.
                const consumedPatterns =
                    /[\(（](已消耗|已用完|已销毁|已銷毀|消耗殆尽|消耗殆盡|消耗|用尽|用盡|consumed|used\s*up|destroyed|depleted)[\)）]/i;

                const holderConsumed =
                    /^(消耗|已消耗|已用完|消耗殆尽|消耗殆盡|用尽|用盡|无|無|consumed|used\s*up|depleted|none)$/i;

                if (
                    consumedPatterns.test(name) ||
                    holderConsumed.test(newInfo.holder || '')
                ) {
                    const cleanName = name.replace(consumedPatterns, '').trim();
                    const baseName = this.getItemBaseName(cleanName || name);

                    for (const itemName of Object.keys(state.items)) {
                        if (
                            this.getItemBaseName(itemName).toLowerCase() ===
                            baseName.toLowerCase()
                        ) {
                            delete state.items[itemName];
                            console.log(
                                `[Horae] 物品已消耗自动删除: ${itemName}`,
                            );
                        }
                    }

                    continue;
                }

                // Ищем существующую запись по базовому названию предмета.
                const existingKey = this.findExistingItemByBaseName(
                    state.items,
                    name,
                );

                if (existingKey) {
                    const existingItem = state.items[existingKey];
                    const mergedItem = { ...existingItem };
                    const locked = !!existingItem._locked;

                    if (!locked && newInfo.icon) {
                        mergedItem.icon = newInfo.icon;
                    }

                    if (!locked) {
                        const importanceRank = { '': 0, '!': 1, '!!': 2 };
                        const newRank = importanceRank[newInfo.importance] ?? 0;
                        const oldRank = importanceRank[existingItem.importance] ?? 0;

                        mergedItem.importance =
                            newRank >= oldRank
                                ? (newInfo.importance || '')
                                : (existingItem.importance || '');
                    }

                    // Местонахождение и держатель обновляются даже у защищённых записей.
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

                    // При изменении ключа переносим объединённую запись под новое название.
                    if (existingKey !== name) {
                        delete state.items[existingKey];
                    }

                    state.items[name] = mergedItem;
                } else {
                    state.items[name] = newInfo;
                }
            }
        }

        // Удаляем предметы по точному названию или совпадению базового имени.
        if (meta.deletedItems && meta.deletedItems.length > 0) {
            for (const deletedItem of meta.deletedItems) {
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
    }
}