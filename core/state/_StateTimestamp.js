// SillyTavern-Horae/core/state/_StateTimestamp.js
/**
 * Подсистема состояния: временная метка сюжета.
 *
 * Применяет изменения даты и времени сюжета из метаданных сообщений.
 * Дата и время обновляются независимо друг от друга;
 * отсутствующие или пустые значения не перезаписывают состояние.
 */

// ===== КЛАСС =====
export class StateTimestamp {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Обновляет дату и время сюжета из метаданных.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (meta.timestamp?.story_date) {
            state.timestamp.story_date = meta.timestamp.story_date;
        }

        if (meta.timestamp?.story_time) {
            state.timestamp.story_time = meta.timestamp.story_time;
        }
    }
}