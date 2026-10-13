/**
 * Применяет изменения настроения персонажей из метаданных сообщений.
 */
export class StateMood {
    /**
     * Обновляет настроение по принципу последнего заданного значения.
     */
    apply(state, meta) {
        if (!meta.mood) return;

        for (const [charName, emotion] of Object.entries(meta.mood)) {
            state.mood[charName] = emotion;
        }
    }
}