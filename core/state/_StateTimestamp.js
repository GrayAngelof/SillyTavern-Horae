/**
 * Применяет изменения даты и времени сюжета из метаданных сообщений.
 */
export class StateTimestamp {
    /**
     * Обновляет дату и время независимо друг от друга.
     * Отсутствующие или пустые значения не перезаписывают состояние.
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