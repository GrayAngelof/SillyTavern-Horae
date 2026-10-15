// SillyTavern-Horae/core/state/_StateScene.js
/**
 * Подсистема состояния: сцена.
 *
 * Применяет изменения сцены из метаданных сообщений.
 * Предыдущее местоположение сохраняется для других подсистем.
 */

// ===== КЛАСС =====
export class StateScene {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Обновляет местоположение, атмосферу и список присутствующих персонажей.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (meta.scene?.location) {
            state._previousLocation = state.scene.location;
            state.scene.location = meta.scene.location;
        }

        if (meta.scene?.atmosphere) {
            state.scene.atmosphere = meta.scene.atmosphere;
        }
    }
}