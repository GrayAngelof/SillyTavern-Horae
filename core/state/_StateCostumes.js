/**
 * Применяет изменения костюмов персонажей из метаданных сообщений.
 */
export class StateCostumes {
    /**
     * Объединяет новые данные с накопленным состоянием костюмов.
     * Существующие ключи перезаписываются, остальные сохраняются.
     */
    apply(state, meta) {
        if (meta.costumes) {
            Object.assign(state.costumes, meta.costumes);
        }
    }
}