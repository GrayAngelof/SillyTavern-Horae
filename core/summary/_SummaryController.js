
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

import {
    getPanelCostumeAndItemData,
    getPanelAffectionData,
    getPanelAgendaData,
    getPanelRelationships,
} from './_SummaryStateService.js';

import { buildPanelContent } from './_SummaryView.js';

// Подготавливает данные для отображения панели Summary.
export function preparePanelData(messageIndex, meta, {
    horaeManager,
    settings,
}) {
    const { costumeEntries, itemsAtMessage } = getPanelCostumeAndItemData(
        messageIndex,
        meta,
        horaeManager
    );

    const chat = horaeManager.getChat();
    const affectionEntries = getPanelAffectionData(meta, chat, messageIndex);
    const agendaEntries = getPanelAgendaData(messageIndex, horaeManager);
    const relationships = getPanelRelationships(meta, {
        settings,
        horaeManager,
    });

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