// SillyTavern-Horae/core/state/_StateRelationships.js
/**
 * Подсистема состояния: отношения между персонажами.
 *
 * Агрегирует направленные связи между персонажами.
 * Каждая связь определяется парой from → to.
 * При повторном появлении той же пары новая запись заменяет старую.
 * Обратное направление считается отдельной связью.
 */

// ===== КЛАСС =====
export class StateRelationships {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения отношений из метаданных.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        // Инициализируем список связей в агрегированном состоянии
        if (!Array.isArray(state.relationships)) {
            state.relationships = [];
        }

        // Если сообщение не содержит изменений отношений, состояние не меняется
        if (!Array.isArray(meta?.relationships) || meta.relationships.length === 0) {
            return;
        }

        for (const relationship of meta.relationships) {
            if (!relationship?.from || !relationship?.to) {
                continue;
            }

            const index = this._findRelationshipIndex(
                state.relationships,
                relationship.from,
                relationship.to,
            );

            if (index >= 0) {
                // Полностью заменяем прежнюю запись новыми данными
                state.relationships[index] = { ...relationship };
            } else {
                // Добавляем новую направленную связь
                state.relationships.push({ ...relationship });
            }
        }
    }

    // ---- ВНУТРЕННИЕ МЕТОДЫ ----
    /**
     * Находит индекс связи с заданным направлением from → to.
     *
     * @param {Array} relationships — список существующих связей
     * @param {string} from — источник связи
     * @param {string} to — цель связи
     * @returns {number} Индекс найденной связи или -1
     */
    _findRelationshipIndex(relationships, from, to) {
        return relationships.findIndex(
            existing => existing.from === from && existing.to === to,
        );
    }
}