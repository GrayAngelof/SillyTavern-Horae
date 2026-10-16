// SillyTavern-Horae/core/summary/_SummaryView.js
/**
 * Представление подсистемы Summary.
 *
 * Отвечает за преобразование подготовленных данных в HTML-разметку
 * элементов интерфейса и редакторов панели сообщений.
 *
 * Не управляет состоянием приложения, не обращается к horaeManager,
 * не анализирует историю сообщений и не выполняет бизнес-логику.
 * Получает готовые данные и параметры отображения через аргументы.
 *
 * Внутренний модуль. Внешний код должен обращаться к представлению
 * через публичный фасад core/summary.js.
 */

// ===== ИМПОРТЫ =====
import { renderPanelAffection } from './_SummaryView/AffectionHtml.js';
import { renderPanelAgenda } from './_SummaryView/AgendaHtml.js';
import { renderPanelAtmosphere } from './_SummaryView/AtmosphereHtml.js';
import { renderPanelCharacters } from './_SummaryView/CharactersHtml.js';
import { renderPanelCostumes } from './_SummaryView/CostumeHtml.js';
import { renderDeletedItems } from './_SummaryView/DeletedItemsHtml.js';
import { renderPanelEvents } from './_SummaryView/EventsHtml.js';
import { renderPanelItems } from './_SummaryView/ItemHtml.js';
import { renderPanelLocation } from './_SummaryView/LocationHtml.js';
import { renderMessagePanelHtml } from './_SummaryView/MessagePanelHtml.js';
import { renderPanelMood } from './_SummaryView/MoodHtml.js';
import { renderPanelContentHtml } from './_SummaryView/PanelContentHtml.js';
import { renderPanelRelationships } from './_SummaryView/RelationshipsHtml.js';
import { renderPanelTimestamp } from './_SummaryView/TimestampHtml.js';


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Формирует полный HTML панели Summary.
 *
 * Собирает содержимое панели из готовых HTML-блоков
 * и оборачивает его в оболочку панели сообщения.
 *
 * @param {Object} data — подготовленные данные для View
 * @param {Object} options — параметры панели и зависимости отображения
 * @param {number} options.messageIndex — индекс сообщения
 * @param {boolean} options.isSkipped — пропущено ли сообщение
 * @param {string} options.layoutClass — CSS-класс раскладки
 * @param {string} options.dataLevel — уровень события
 * @param {string} options.time — время
 * @param {string} options.eventSummary — описание события
 * @param {number} options.charCount — количество персонажей
 * @param {string} options.sideplayBtnStyle — стиль кнопки sideplay
 * @param {Function} options.escapeHtml — функция экранирования HTML
 * @param {Function} options.t — функция локализации
 * @returns {string} Полный HTML панели
 */
export function buildPanelHtml(data, {
    messageIndex,
    isSkipped,
    layoutClass,
    dataLevel,
    time,
    eventSummary,
    charCount,
    sideplayBtnStyle,
    escapeHtml,
    t,
}) {
    const contentHtml = _buildPanelContent(data, {
        escapeHtml,
        t,
    });

    return renderMessagePanelHtml({
        messageIndex,
        isSkipped,
        layoutClass,
        dataLevel,
        time,
        eventSummary,
        charCount,
        sideplayBtnStyle,
        contentHtml,
        t,
    });
}


// ===== ВНУТРЕННИЕ ФУНКЦИИ =====
/**
 * Формирует содержимое панели Summary из готовых HTML-блоков.
 *
 * @param {Object} data — данные панели
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка содержимого панели
 */
function _buildPanelContent(data, {
    escapeHtml,
    t,
}) {
    const {
        timestampValue,
        locationValue,
        atmosphereValue,
        charactersValue,
        costumeEntries,
        itemsAtMessage,
        deletedItems,
        affectionEntries,
        relationships,
        agendaEntries,
        moodEntries,
        events,
    } = data;

    const options = { escapeHtml, t };

    // Преобразуем строку присутствующих персонажей в массив
    const characters = String(charactersValue ?? '')
        .split(',')
        .map(name => name.trim())
        .filter(Boolean);

    // Основные поля
    const timestampHtml = renderPanelTimestamp(timestampValue, options);
    const locationHtml = renderPanelLocation(locationValue, options);
    const atmosphereHtml = renderPanelAtmosphere(atmosphereValue, options);
    const charactersHtml = renderPanelCharacters(charactersValue, options);

    // Костюмы, настроение и привязанности присутствующих персонажей
    const costumeHtml = renderPanelCostumes(characters, costumeEntries, options);
    const moodHtml = renderPanelMood(characters, moodEntries, options);
    const affectionHtml = renderPanelAffection(characters, affectionEntries, options);

    // Предметы и удалённые предметы
    const itemHtml = renderPanelItems(itemsAtMessage, options);
    const deletedItemsHtml = renderDeletedItems(deletedItems, options);

    // События текущего сообщения
    const eventsArr = Array.isArray(events) ? events : [];
    const firstEvent = eventsArr[0] || {};

    const eventsHtml = renderPanelEvents({
        eventLevel: firstEvent.level || '',
        eventSummary: firstEvent.summary || '',
        hasMultipleEvents: eventsArr.length > 1,
        multipleEventsNoteText: eventsArr.length > 1
            ? t('ui.multipleEventsNote', { n: eventsArr.length })
            : '',
    }, options);

    // Повестка и отношения
    const agendaHtml = renderPanelAgenda(agendaEntries, options);
    const relationshipsHtml = renderPanelRelationships(relationships, options);

    // Собираем панель из готовых HTML-фрагментов
    return renderPanelContentHtml({
        timestampHtml,
        locationHtml,
        atmosphereHtml,
        charactersHtml,
        costumeHtml,
        moodHtml,
        itemHtml,
        deletedItemsHtml,
        eventsHtml,
        affectionHtml,
        agendaHtml,
        relationshipsHtml,
        t,
    });
}