// SillyTavern-Horae/core/state/_StateNpcs.js
/**
 * Подсистема состояния: НПС.
 *
 * Объединяет сведения о НПС из метаданных сообщений
 * и удаляет персонажей, которых пользователь исключил из состояния.
 */

// ===== КОНСТАНТЫ =====
// Поля, которые обновляются при наличии новых значений
const UPDATABLE_FIELDS = [
    'appearance',
    'personality',
    'relationship',
    'age',
    'job',
    'note',
];

// Поля, которые заполняются только один раз (при первом появлении значения)
const PROTECTED_FIELDS = [
    'gender',
    'race',
    'birthday',
];


// ===== КЛАСС =====
export class StateNpcs {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения НПС из метаданных одного сообщения.
     *
     * Изменяемые поля обновляются при наличии новых значений,
     * защищённые поля заполняются только при отсутствии прежних.
     * При изменении возраста обновляется дата, относительно которой
     * определяется возраст персонажа.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (!meta.npcs) return;

        for (const [name, newNpc] of Object.entries(meta.npcs)) {
            const existing = state.npcs[name];

            if (existing) {
                this._updateExistingNpc(existing, newNpc, state);
            } else {
                state.npcs[name] = this._createNewNpc(newNpc, state);
            }
        }
    }

    /**
     * Удаляет НПС, исключённых пользователем из актуального состояния,
     * вместе со связанными сведениями в других разделах метаданных.
     *
     * Источник списка — первое сообщение чата; обработка выполняется
     * после агрегации истории, чтобы удалённые записи не восстанавливались.
     *
     * @param {Object} state — текущее состояние
     * @param {Array} chat — массив сообщений чата
     */
    removeDeleted(state, chat) {
        const deletedNpcs = chat[0]?.horae_meta?._deletedNpcs;

        if (!deletedNpcs?.length) return;

        for (const name of deletedNpcs) {
            delete state.npcs[name];
            delete state.affection[name];
            delete state.costumes[name];
            delete state.mood[name];

            if (state.characters_present) {
                state.characters_present = state.characters_present.filter(
                    character => character !== name,
                );
            }
        }
    }

    // ---- ВНУТРЕННИЕ МЕТОДЫ ----
    /**
     * Обновляет существующую запись НПС новыми данными.
     *
     * ВАЖНО: сравнение возрастов выполняется ДО обновления existing.age,
     * иначе оно теряет смысл (оба значения уже были бы одинаковыми).
     *
     * @param {Object} existing — существующая запись
     * @param {Object} newNpc — новые данные из метаданных
     * @param {Object} state — текущее состояние (для story_date)
     */
    _updateExistingNpc(existing, newNpc, state) {
        // Сначала фиксируем смену возраста (пока existing.age ещё старый)
        this._updateAgeReference(existing, newNpc, state);

        // Затем обновляем изменяемые поля
        for (const field of UPDATABLE_FIELDS) {
            if (newNpc[field] !== undefined) {
                existing[field] = newNpc[field];
            }
        }

        // Защищённые поля заполняются только при отсутствии значения
        for (const field of PROTECTED_FIELDS) {
            if (newNpc[field] !== undefined && !existing[field]) {
                existing[field] = newNpc[field];
            }
        }

        if (newNpc.last_seen) {
            existing.last_seen = newNpc.last_seen;
        }
    }

    /**
     * Обновляет дату-якорь возраста при изменении значения возраста.
     *
     * Вызывается ДО обновления existing.age, чтобы можно было сравнить
     * старое и новое значения. Строковые возрасты (не числа) не влияют
     * на дату-якорь — сохраняется прежнее поведение.
     *
     * @param {Object} existing — существующая запись (age ещё старый)
     * @param {Object} newNpc — новые данные из метаданных
     * @param {Object} state — текущее состояние (для story_date)
     */
    _updateAgeReference(existing, newNpc, state) {
        if (newNpc.age === undefined || newNpc.age === '') {
            return;
        }

        const oldAgeNum = parseInt(existing.age);
        const newAgeNum = parseInt(newNpc.age);

        // Строковые возрасты (не числа) не влияют на дату-якорь
        const isNumericChange =
            !isNaN(oldAgeNum) && !isNaN(newAgeNum) && oldAgeNum !== newAgeNum;

        // При первой установке или при числовом изменении — фиксируем дату
        if (!existing._ageRefDate || isNumericChange) {
            existing._ageRefDate = state.timestamp.story_date || '';
        }
    }

    /**
     * Создаёт новую запись НПС с значениями по умолчанию.
     *
     * @param {Object} newNpc — новые данные из метаданных
     * @param {Object} state — текущее состояние (для story_date)
     * @returns {Object} Новая запись НПС
     */
    _createNewNpc(newNpc, state) {
        const now = new Date().toISOString();

        return {
            appearance: newNpc.appearance || '',
            personality: newNpc.personality || '',
            relationship: newNpc.relationship || '',
            gender: newNpc.gender || '',
            age: newNpc.age || '',
            race: newNpc.race || '',
            job: newNpc.job || '',
            birthday: newNpc.birthday || '',
            note: newNpc.note || '',
            _ageRefDate: newNpc.age ? (state.timestamp.story_date || '') : '',
            first_seen: newNpc.first_seen || now,
            last_seen: newNpc.last_seen || now,
        };
    }
}