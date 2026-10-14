/**
* Обрабатывает список персонажей, присутствующих в сцене.
* Изменяет state.characters_present на основе метаданных сообщения.
*/
export class StateCharacters {
    /**
     * Применяет список присутствующих персонажей из метаданных.
     * Пустой список не перезаписывает ранее сохранённый.
     */
    apply(state, meta) {
        if (!Array.isArray(state.characters_present)) {
            state.characters_present = [];
        }

        if (!meta || !Array.isArray(meta.characters)) {
            return;
        }

        const characters = meta.characters_present;

        if (characters.length === 0) {
            return;
        }

        // Убираем пустые имена и дубликаты, сохраняя исходный порядок.
        state.characters_present = [
            ...new Set(
                characters
                    .map((name) => String(name || '').trim())
                    .filter(Boolean),
            ),
        ];
    }
}