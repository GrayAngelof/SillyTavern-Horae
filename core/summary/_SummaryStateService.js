// SillyTavern-Horae/core/summary/_SummaryStateService.js
/**
 * Сервис подготовки данных подсистемы Summary.
 *
 * Преобразует готовые снимки State в данные, необходимые представлению.
 * Не восстанавливает историю сообщений, не обращается к horaeManager,
 * не фильтрует поля по настройкам и не формирует HTML.
 *
 * Внутренний модуль. Внешний код должен обращаться к сервису
 * через публичный фасад core/summary.js.
 */

// ===== ВНУТРЕННИЕ ФУНКЦИИ =====
/**
 * Находит ключ в словаре без учёта регистра и крайних пробелов.
 *
 * @param {string} name — искомое имя
 * @param {Object} values — словарь для поиска
 * @returns {string|undefined} Найденный ключ или undefined
 */
function findKey(name, values) {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
        return name;
    }

    const normalized = String(name).trim().toLowerCase();

    return Object.keys(values).find(
        key => String(key).trim().toLowerCase() === normalized,
    );
}

/**
 * Преобразует костюмы в пары [имя персонажа, костюм].
 *
 * @param {Array} characters — список имён персонажей
 * @param {Object} costumes — словарь костюмов
 * @returns {Array} Массив пар [имя, костюм]
 */
function prepareCostumeEntries(characters, costumes) {
    const entries = Object.entries(costumes);

    if (characters.length === 0) {
        return entries;
    }

    return characters.map(char => {
        const key = findKey(char, costumes);
        return [char, key !== undefined ? costumes[key] : ''];
    });
}

/**
 * Преобразует настроения в пары [имя персонажа, настроение].
 *
 * @param {Object} mood — словарь настроений
 * @returns {Array} Массив пар [имя, настроение]
 */
function prepareMoodEntries(mood) {
    return Object.entries(mood);
}

/**
 * Подготавливает значения симпатии для редактора.
 */


function prepareAffectionEntries(characters, currentTotals, previousTotals) {
    return characters.map(char => {
        const currentKey = findKey(char, currentTotals);
        const previousKey = findKey(char, previousTotals);

        const hasCurrent = currentKey !== undefined;
        const currentVal = hasCurrent
            ? currentTotals[currentKey] ?? 0
            : 0;

        const prevVal = previousKey !== undefined
            ? previousTotals[previousKey] ?? 0
            : 0;

        const delta = Math.round((currentVal - prevVal) * 100) / 100;
        const total = Math.round(currentVal * 100) / 100;

        return {
            char,
            prevVal,
            deltaStr: hasCurrent
                ? delta >= 0 ? `+${delta}` : `${delta}`
                : '',
            totalStr: hasCurrent ? `${total}` : '',
        };
    });
}


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Подготавливает данные всех полей панели Summary.
 *
 * @param {Object} stateAtMessage — актуальный снимок состояния
 * @param {Object} previousState — предыдущий снимок состояния
 * @param {Object} dependencies — зарезервированные внешние зависимости
 * @returns {Object} Данные для _SummaryView.js
 */
export function preparePanelData(
    stateAtMessage,
    previousState,
    dependencies,
) {
    const state = stateAtMessage ?? {};
    const previous = previousState ?? {};

    const timestampValue = state.timestamp ?? {};
    const scene = state.scene ?? {};
    const characters = Array.isArray(state.characters_present)
        ? state.characters_present
        : [];

    const costumes = state.costumes ?? {};
    const itemsAtMessage = state.items ?? {};
    const currentAffection = state.affection ?? {};
    const previousAffection = previous.affection ?? {};
    const mood = state.mood ?? {};

    return {
        timestampValue,
        locationValue: scene.location ?? '',
        atmosphereValue: scene.atmosphere ?? '',
        charactersValue: characters.join(', '),

        costumeEntries: prepareCostumeEntries(
            characters,
            costumes,
        ),

        itemsAtMessage,
        deletedItems: state.deletedItems ?? [],

        affectionEntries: prepareAffectionEntries(
            characters,
            currentAffection,
            previousAffection,
        ),

        relationships: state.relationships ?? [],
        agendaEntries: state.agenda ?? [],
        moodEntries: prepareMoodEntries(mood),
        events: state.events ?? [],
    };
}