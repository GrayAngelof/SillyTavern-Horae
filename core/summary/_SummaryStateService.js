/**
 * Кэш накопленных значений симпатии по истории сообщений.
 */
let affectionCache = [];
let affectionCacheLen = -1;

/**
 * Возвращает предыдущие и текущие накопленные значения симпатии.
 *
 * Пересчитывает историю только при изменении количества сообщений,
 * сохраняя прежнее поведение buildPanelContent.
 */
export function getAffectionTotals(chat, messageIndex) {
    if (affectionCacheLen !== chat.length) {
        affectionCache = [];
        affectionCacheLen = chat.length;

        const running = {};

        for (let i = 0; i < chat.length; i++) {
            const meta = chat[i]?.horae_meta;

            if (meta?.affection) {
                for (const [key, value] of Object.entries(meta.affection)) {
                    let total = 0;

                    if (typeof value === 'object' && value !== null) {
                        if (value.type === 'absolute') {
                            total = parseFloat(value.value) || 0;
                        } else if (value.type === 'relative') {
                            total = (running[key] || 0)
                                + (parseFloat(value.value) || 0);
                        }
                    } else {
                        total = (running[key] || 0)
                            + (parseFloat(value) || 0);
                    }

                    running[key] = total;
                }
            }

            affectionCache[i] = { ...running };
        }
    }

    const prevTotals = {};

    if (messageIndex > 0 && affectionCache[messageIndex - 1]) {
        Object.assign(prevTotals, affectionCache[messageIndex - 1]);
    }

    const currentTotals = affectionCache[messageIndex] || {};

    return {
        prevTotals,
        currentTotals,
    };
}