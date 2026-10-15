// SillyTavern-Horae/core/state/_StateEvents.js
/**
 * Подсистема состояния: события.
 *
 * Применяет изменения списка событий из метаданных сообщений.
 * Новые события добавляются в конец накопленного списка.
 *
 */

// ===== КЛАСС =====
export class StateEvents {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения событий из метаданных.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (!Array.isArray(state.events)) {
            state.events = [];
        }

        if (!Array.isArray(meta?.events) || meta.events.length === 0) {
            return;
        }

        state.events.push(...meta.events);
    }
}