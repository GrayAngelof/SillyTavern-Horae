/**
 * Применяет изменения показателей расположения персонажей
 * из метаданных сообщений.
 */
export class StateAffection {
    /**
     * Поддерживает абсолютные значения, относительные изменения
     * и прежний формат метаданных с числовыми значениями.
     */
    apply(state, meta) {
        if (!meta.affection) return;

        for (const [key, value] of Object.entries(meta.affection)) {
            if (typeof value === 'object' && value !== null) {
                if (value.type === 'absolute') {
                    state.affection[key] = parseFloat(value.value) || 0;
                } else if (value.type === 'relative') {
                    const delta = parseFloat(value.value) || 0;
                    state.affection[key] =
                        (state.affection[key] || 0) + delta;
                }
            } else {
                // Поддерживаем прежний формат, в котором значение
                // всегда прибавляется к накопленному результату.
                const numValue = typeof value === 'number'
                    ? value
                    : parseFloat(value) || 0;

                state.affection[key] =
                    (state.affection[key] || 0) + numValue;
            }
        }
    }
}