/**
 * Обрабатывает добавление, обновление и удаление задач
 * по метаданным одного сообщения.
 * Изменяет state.agenda, сохраняя существующий порядок задач
 * и правила сопоставления записей при удалении.
 */
export class StateAgenda {
    /**
     * Применяет изменения задач из метаданных сообщения.
     * Сначала добавляет и обновляет задачи, затем удаляет
     * записи, соответствующие deletedAgenda.
     */
    apply(state, meta) {
        if (!Array.isArray(state.agenda)) {
            state.agenda = [];
        }

        if (!meta) return;

        // Добавляем новые задачи и обновляем существующие.
        if (Array.isArray(meta.agenda)) {
            for (const item of meta.agenda) {
                const text = String(item?.text || '').trim();
                if (!text) continue;

                const existingIndex = state.agenda.findIndex(
                    (entry) =>
                        String(entry?.text || '').trim() === text,
                );

                if (existingIndex !== -1) {
                    state.agenda[existingIndex] = item;
                } else {
                    state.agenda.push(item);
                }
            }
        }

        // Удаляем задачи по точному или частичному совпадению текста.
        if (Array.isArray(meta.deletedAgenda)) {
            for (const item of meta.deletedAgenda) {
                const text = String(
                    typeof item === 'string' ? item : item?.text || '',
                ).trim();

                if (!text) continue;

                state.agenda = state.agenda.filter((entry) => {
                    const existingText = String(
                        entry?.text || '',
                    ).trim();

                    return !(
                        existingText === text ||
                        existingText.includes(text) ||
                        text.includes(existingText)
                    );
                });
            }
        }
    }
}