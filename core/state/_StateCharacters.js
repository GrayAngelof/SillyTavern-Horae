// SillyTavern-Horae/core/state/_StateCharacters.js
/**
 * Подсистема состояния: присутствующие персонажи.
 *
 * Применяет изменения списка персонажей из метаданных сообщений.
 *
 */

// ===== КЛАСС =====
export class StateCharacters {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет список присутствующих персонажей из метаданных.
     *
     * Пустой список не перезаписывает ранее сохранённый.
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (!Array.isArray(state.characters_present)) {
            state.characters_present = [];
        }

        if (!meta || !Array.isArray(meta.characters_present)) {
            return;
        }

        const characters = meta.characters_present;

        if (characters.length === 0) {
            return;
        }

        // Убираем пустые имена и дубликаты, сохраняя исходный порядок
        state.characters_present = [
            ...new Set(
                characters
                    .map((name) => String(name || '').trim())
                    .filter(Boolean),
            ),
        ];
    }
}