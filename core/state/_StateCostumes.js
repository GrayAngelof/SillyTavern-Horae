// SillyTavern-Horae/core/state/_StateCostumes.js
/**
 * Подсистема состояния: костюмы персонажей.
 *
 * Применяет изменения костюмов из метаданных сообщений.
 * Объединяет новые данные с накопленным состоянием:
 * существующие ключи перезаписываются, остальные сохраняются.
 */

// ===== КЛАСС =====
export class StateCostumes {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения костюмов персонажей из метаданных.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (meta.costumes) {
            Object.assign(state.costumes, meta.costumes);
        }
    }
}