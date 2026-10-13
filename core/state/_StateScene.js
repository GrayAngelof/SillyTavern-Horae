/**
 * Применяет изменения сцены из метаданных сообщений.
 */
export class StateScene {
    /**
     * Обновляет местоположение, атмосферу и список присутствующих персонажей.
     * Предыдущее местоположение сохраняется для других подсистем.
     */
    apply(state, meta) {
        if (meta.scene?.location) {
            state._previousLocation = state.scene.location;
            state.scene.location = meta.scene.location;
        }

        if (meta.scene?.atmosphere) {
            state.scene.atmosphere = meta.scene.atmosphere;
        }

        if (meta.scene?.characters_present?.length > 0) {
            state.scene.characters_present = [
                ...meta.scene.characters_present,
            ];
        }
    }
}