/**
 * Сервис состояния подсистемы Summary.
 *
 * Отвечает за получение и подготовку данных, необходимых для отображения
 * сводки, включая вычисляемые значения на основе истории сообщений
 * и получение связанных данных из horaeManager.
 *
 * Может содержать логику обработки состояния и кэширования результатов.
 * Не отвечает за формирование HTML-разметки и управление жизненным циклом
 * элементов интерфейса.
 *
 * Внутренний модуль. Внешний код должен обращаться к его функциям
 * через публичный фасад core/summary.js.
 */

/**
 * Возвращает предыдущие и текущие накопленные значения симпатии
 * через общий механизм восстановления состояния Horae.
 */
export function getAffectionTotals(
    chat,
    messageIndex,
    horaeManager,
    stateAtMessage
) {
    const prevSkipLast = chat.length - messageIndex;

    const prevState = messageIndex > 0
        ? horaeManager.getLatestState(prevSkipLast).affection || {}
        : {};

    const currentState = stateAtMessage.affection || {};

    return {
        prevTotals: prevState,
        currentTotals: currentState,
    };
}

// Возвращает социальные отношения персонажей текущей сцены.
export function getPanelRelationships(meta, { settings, horaeManager }) {
    if (!settings.sendRelationships) return [];
    const presentChars = meta.scene?.characters_present || [];
    return horaeManager.getRelationshipsForCharacters(presentChars);
}

// Подготавливает данные о костюмах для панели Summary на выбранном сообщении.
export function getPanelCostumeData(meta, stateAtMessage) {
    const presentChars = meta.scene?.characters_present || [];
    const allCostumes = stateAtMessage.costumes || {};

    const findCostume = (name) => {
        if (allCostumes[name]) return allCostumes[name];

        const normalized = name.trim().toLowerCase();
        const match = Object.entries(allCostumes).find(
            ([char]) => char.trim().toLowerCase() === normalized
        );

        return match?.[1] || '';
    };

    const costumeEntries = presentChars.length > 0
        ? presentChars.map(char => [char, findCostume(char)])
        : Object.entries(meta.costumes || {});

    return { costumeEntries };
}

// Подготавливает данные о предметах для панели Summary на выбранном сообщении.
export function getPanelItemData(stateAtMessage) {
    return {
        itemsAtMessage: stateAtMessage.items || {},
    };
}

// Подготавливает данные симпатии персонажей для панели Summary на выбранном сообщении.
export function getPanelAffectionData(
    meta,
    chat,
    messageIndex,
    horaeManager,
    stateAtMessage
) {
    const { prevTotals, currentTotals } = getAffectionTotals(
        chat,
        messageIndex,
        horaeManager,
        stateAtMessage
    );
    const presentChars = meta.scene?.characters_present || [];
    const affectionKeys = [...new Set([
        ...presentChars,
        ...Object.keys(meta.affection || {}),
    ])];
    const findAffectionKey = (name, values) => {
        if (Object.prototype.hasOwnProperty.call(values, name)) return name;
        const normalized = name.trim().toLowerCase();
        return Object.keys(values).find(
            key => key.trim().toLowerCase() === normalized
        );
    };
    const entries = affectionKeys.map(char => {
        const key = findAffectionKey(char, {
            ...prevTotals,
            ...currentTotals,
            ...(meta.affection || {}),
        }) || char;
        
        const hasTotal = Object.prototype.hasOwnProperty.call(currentTotals, key);
        const prevVal = prevTotals[key] || 0;
        let delta = 0;
        let newTotal = 0;
        let hasDelta = false;

        if (hasTotal) {
            newTotal = currentTotals[key];
            delta = newTotal - prevVal;
            hasDelta = Object.prototype.hasOwnProperty.call(meta.affection || {}, key);
        }

        delta = Math.round(delta * 100) / 100;
        newTotal = Math.round(newTotal * 100) / 100;

        let deltaStr = '';
        let totalStr = '';

        if (hasDelta) {
            deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
            totalStr = `${newTotal}`;
        } else if (hasTotal) {
            totalStr = `${newTotal}`;
            deltaStr = '+0';
        }
        return {
            char,
            prevVal,
            deltaStr,
            totalStr,
        };
    });
    return entries;
}

/**
 * Восстанавливает активную повестку по истории до выбранного сообщения.
 * Учитывает добавленные и удалённые задачи из сохранённых метаданных
 * и разобранных тегов Horae, включая резервное извлечение удалений
 * непосредственно из текста сообщений.
 */
export function getPanelAgendaData(messageIndex, horaeManager) {
    const chat = horaeManager.getChat();
    const active = new Map();
    for (let i = 0; i <= messageIndex && i < chat.length; i++) {
        const message = chat[i];
        const rawText = message?.mes || '';
        const storedMeta = message?.horae_meta;
        const parsedMeta = horaeManager.parseHoraeTag(rawText);

        // Сначала учитываем задачи, добавленные на этом ходу.
        const added = [
            ...(Array.isArray(storedMeta?.agenda) ? storedMeta.agenda : []),
            ...(Array.isArray(parsedMeta?.agenda) ? parsedMeta.agenda : []),
        ];
        for (const item of added) {
            const text = String(item?.text || '').trim();
            if (text) {
                active.set(text, item);
            }
        }

        // Затем удаляем задачи по данным deletedAgenda.
        const removed = [
            ...(Array.isArray(storedMeta?.deletedAgenda)
                ? storedMeta.deletedAgenda
                : []),
            ...(Array.isArray(parsedMeta?.deletedAgenda)
                ? parsedMeta.deletedAgenda
                : []),
        ];

        for (const item of removed) {
            const text = String(
                typeof item === 'string' ? item : item?.text || ''
            ).trim();
            if (!text) continue;

            // Допускаем небольшие различия в формулировках.
            for (const [key, value] of active.entries()) {
                const existingText = String(value?.text || key).trim();
                if (
                    existingText === text ||
                    existingText.includes(text) ||
                    text.includes(existingText)
                ) {
                    active.delete(key);
                }
            }
        }

        // Резервное извлечение удалений непосредственно из текста.
        const removalRegex = /(?:^|\n)\s*\*\*\*agenda-\s*:\s*(.+?)\*\*\*(?=\n|$)/g;
        for (const match of rawText.matchAll(removalRegex)) {
            const text = match[1].trim().replace(/\*\*\*/g, '');
            if (text) active.delete(text);
        }
    }
    return [...active.values()];
}
