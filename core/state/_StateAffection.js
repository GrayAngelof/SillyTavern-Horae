// SillyTavern-Horae/core/state/_StateAffection.js
/**
 * Подсистема состояния: показатели расположения персонажей.
 *
 * Применяет изменения расположения из метаданных сообщений.
 */

// ===== КЛАСС =====
export class StateAffection {
    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Применяет изменения показателей расположения персонажей из метаданных.
     *
     * Поддерживает:
     * - абсолютные значения (type === 'absolute')
     * - относительные изменения (type === 'relative')
     * - прежний формат с числовыми значениями (всегда прибавляется)
     *
     * @param {Object} state — текущее состояние
     * @param {Object} meta — метаданные сообщения
     */
    apply(state, meta) {
        if (!meta.affection) return;

        for (const [key, value] of Object.entries(meta.affection)) {
            if (typeof value === 'object' && value !== null) {
                if (value.type === 'absolute') {
                    state.affection[key] = parseFloat(value.value) || 0;
                } else if (value.type === 'relative') {
                    const delta = parseFloat(value.value) || 0;
                    state.affection[key] = (state.affection[key] || 0) + delta;
                }
            } else {
                // Прежний формат: значение всегда прибавляется к накопленному
                const numValue = typeof value === 'number'
                    ? value
                    : parseFloat(value) || 0;

                state.affection[key] = (state.affection[key] || 0) + numValue;
            }
        }
    }
}