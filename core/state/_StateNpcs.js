/**
 * Объединяет сведения о НПС из метаданных сообщений
 * и удаляет персонажей, которых пользователь исключил из состояния.
 */
export class StateNpcs {
    /**
     * Применяет изменения НПС из метаданных одного сообщения.
     *
     * Изменяемые поля обновляются при наличии новых значений,
     * защищённые поля заполняются только при отсутствии прежних.
     * При изменении возраста обновляется дата, относительно которой
     * определяется возраст персонажа.
     */
    apply(state, meta) {
        if (!meta.npcs) return;

        const updatableFields = [
            'appearance',
            'personality',
            'relationship',
            'age',
            'job',
            'note',
        ];

        const protectedFields = [
            'gender',
            'race',
            'birthday',
        ];

        for (const [name, newNpc] of Object.entries(meta.npcs)) {
            const existing = state.npcs[name];

            if (existing) {
                for (const field of updatableFields) {
                    if (newNpc[field] !== undefined) {
                        existing[field] = newNpc[field];
                    }
                }

                // При изменении возраста фиксируем текущую дату сюжета.
                if (newNpc.age !== undefined && newNpc.age !== '') {
                    if (!existing._ageRefDate) {
                        existing._ageRefDate =
                            state.timestamp.story_date || '';
                    }

                    const oldAgeNum = parseInt(existing.age);
                    const newAgeNum = parseInt(newNpc.age);

                    if (
                        !isNaN(oldAgeNum) &&
                        !isNaN(newAgeNum) &&
                        oldAgeNum !== newAgeNum
                    ) {
                        existing._ageRefDate =
                            state.timestamp.story_date || '';
                    }
                }

                // Защищённые поля заполняются только один раз,
                // пока у существующей записи нет соответствующего значения.
                for (const field of protectedFields) {
                    if (
                        newNpc[field] !== undefined &&
                        !existing[field]
                    ) {
                        existing[field] = newNpc[field];
                    }
                }

                if (newNpc.last_seen) {
                    existing.last_seen = newNpc.last_seen;
                }
            } else {
                // Создаём запись с теми же значениями по умолчанию,
                // что использовались в исходном контроллере.
                state.npcs[name] = {
                    appearance: newNpc.appearance || '',
                    personality: newNpc.personality || '',
                    relationship: newNpc.relationship || '',
                    gender: newNpc.gender || '',
                    age: newNpc.age || '',
                    race: newNpc.race || '',
                    job: newNpc.job || '',
                    birthday: newNpc.birthday || '',
                    note: newNpc.note || '',
                    _ageRefDate: newNpc.age
                        ? (state.timestamp.story_date || '')
                        : '',
                    first_seen: newNpc.first_seen || new Date().toISOString(),
                    last_seen: newNpc.last_seen || new Date().toISOString(),
                };
            }
        }
    }

    /**
     * Удаляет НПС, исключённых пользователем из актуального состояния,
     * вместе со связанными сведениями в других разделах метаданных.
     *
     * Источник списка — первое сообщение чата; обработка выполняется
     * после агрегации истории, чтобы удалённые записи не восстанавливались.
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
                state.characters_present =
                    state.characters_present.filter(
                        character => character !== name,
                    );
            }
        }
    }
}