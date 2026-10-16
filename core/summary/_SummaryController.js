// SillyTavern-Horae/core/summary/_SummaryController.js
/**
 * Контроллер подсистемы Summary.
 *
 * Координирует подготовку данных и формирование содержимого панели.
 * Получает данные состояния через _SummaryStateService.js
 * и передаёт их в _SummaryView.js для отображения.
 *
 * Не содержит HTML-разметку и не реализует собственную логику
 * анализа истории сообщений.
 *
 * Внутренний модуль. Внешний код должен обращаться к контроллеру
 * через публичный фасад core/summary.js.
 */

// ===== ИМПОРТЫ =====
import {
    preparePanelData as prepareSummaryData,
} from './_SummaryStateService.js';
import { buildPanelContent } from './_SummaryView.js';


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Подготавливает данные для отображения панели Summary.
 *
 * Вычисляет снимок состояния на текущем сообщении и на предыдущем,
 * затем передаёт их в сервис подготовки данных.
 *
 * @param {number} messageIndex — индекс сообщения в чате
 * @param {Object} meta — метаданные сообщения
 * @param {Object} deps — зависимости
 * @param {Object} deps.horaeManager — менеджер чата
 * @param {Object} deps.stateService — сервис состояния
 * @param {Object} deps.settings — настройки расширения
 * @returns {Object} Подготовленные данные для View
 */
export function preparePanelData(messageIndex, meta, {
    horaeManager,
    stateService,
    settings,
}) {
    const chat = horaeManager.getChat();

    const skipLast = Math.max(
        0,
        chat.length - messageIndex - 1,
    );

    const stateAtMessage = stateService.getLatestState(
        chat,
        skipLast,
    );

    const previousState = messageIndex > 0
        ? stateService.getLatestState(
            chat,
            chat.length - messageIndex,
        )
        : {};

    return prepareSummaryData(
        stateAtMessage,
        previousState,
        { settings },
    );
}

/**
 * Подготавливает данные и формирует HTML содержимого панели Summary.
 *
 * @param {number} messageIndex — индекс сообщения в чате
 * @param {Object} meta — метаданные сообщения
 * @param {Object} deps — зависимости
 * @param {Object} deps.horaeManager — менеджер чата
 * @param {Object} deps.stateService — сервис состояния
 * @param {Object} deps.settings — настройки расширения
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка содержимого панели
 */
export function renderPanelContent(messageIndex, meta, {
    horaeManager,
    stateService,
    settings,
    escapeHtml,
    t,
}) {
    const data = preparePanelData(messageIndex, meta, {
        horaeManager,
        stateService,
        settings,
    });

    return buildPanelContent(data, {
        settings,
        escapeHtml,
        t,
    });
}

// Подготавливает CSS-классы панели на основе настроек и уровня события.
export function preparePanelStyleData(meta, settings) {
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);
    const firstLevel = (eventsArr.find(e => e && e.level)?.level || '').trim();

    const levelMap = {
        '一般': 'normal',
        '重要': 'important',
        '关键': 'critical',
        '關鍵': 'critical',
    };

    const dataLevel = levelMap[firstLevel] || (firstLevel ? 'normal' : '');

    const layoutClass = settings.panelLayoutStyle === 'glass'
        ? ' horae-layout-glass'
        : settings.panelLayoutStyle === 'obsidian'
            ? ' horae-layout-obsidian'
            : settings.panelLayoutStyle === 'cyber'
                ? ' horae-layout-cyber'
                : '';

    return { layoutClass, dataLevel };
}

// Подготавливает данные сводки события для заголовка панели.
export function preparePanelSummaryData(meta, t) {
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);

    const eventSummary = eventsArr.length > 0
        ? eventsArr.map(e => e.summary).join(' | ')
        : t('ui.noSpecialEvents');

    const charCount = meta.characters_present?.length || 0;

    return { eventSummary, charCount };
}

// Подготавливает отображаемое время сообщения.
export function preparePanelTime(meta, parseStoryDate, formatStoryDate) {
    let time = '--';

    if (meta.timestamp?.story_date) {
        const parsed = parseStoryDate(meta.timestamp.story_date);

        if (parsed && parsed.type === 'standard') {
            time = formatStoryDate(parsed, true);
        } else {
            time = meta.timestamp.story_date;
        }

        if (meta.timestamp.story_time) {
            time += ' ' + meta.timestamp.story_time;
        }
    }

    return time;
}

// Подготавливает данные режима sideplay для панели сообщения.
export function preparePanelSideplayData(meta, settings) {
    const isSkipped = !!meta._skipHorae;
    const sideplayBtnStyle = settings.sideplayMode ? '' : 'display:none;';

    return { isSkipped, sideplayBtnStyle };
}