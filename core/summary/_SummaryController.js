
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

import { buildPanelContent } from './_SummaryView.js';

import {
    getPanelCostumeData,
    getPanelItemData,
    getPanelAffectionData,
    getPanelAgendaData,
    getPanelRelationships,
} from './_SummaryStateService.js';

// Подготавливает данные для отображения панели Summary.
export function preparePanelData(messageIndex, meta, {
    horaeManager,
    settings,
}) {
    const chat = horaeManager.getChat();
    const skipLast = Math.max(0, chat.length - messageIndex - 1);
    const stateAtMessage = horaeManager.getLatestState(skipLast);

    const { costumeEntries } = getPanelCostumeData(
        meta,
        stateAtMessage
    );

    const { itemsAtMessage } = getPanelItemData(
        stateAtMessage
    );
    const agendaEntries = getPanelAgendaData(messageIndex, horaeManager);
    const relationships = getPanelRelationships(meta, {
        settings,
        horaeManager,
    });
    const affectionEntries = getPanelAffectionData(
        meta,
        chat,
        messageIndex,
        horaeManager,
        stateAtMessage
    );

    return {
        costumeEntries,
        itemsAtMessage,
        affectionEntries,
        agendaEntries,
        relationships,
    };
}

// Подготавливает данные и формирует HTML содержимого панели Summary.
export function renderPanelContent(messageIndex, meta, {
    horaeManager,
    settings,
    escapeHtml,
    t,
}) {
    const data = preparePanelData(messageIndex, meta, {
        horaeManager,
        settings,
    });

    return buildPanelContent(meta, data, {
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