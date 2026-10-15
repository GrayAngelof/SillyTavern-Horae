// SillyTavern-Horae/core/state/_StateMood.js
/**
 * Подсистема состояния: настроение персонажей.
 *
 * Применяет изменения настроения из метаданных сообщений
 * по принципу последнего заданного значения.
 */

// ===== КЛАСС =====
export class StateMood {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Обновляет настроение персонажей из метаданных.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (!meta.mood) return;

        for (const [charName, emotion] of Object.entries(meta.mood)) {
            state.mood[charName] = emotion;
        }
    }
}