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


import {
    preparePanelData as prepareSummaryData,
} from './_SummaryStateService.js';

import {
    buildPanelContent,
} from './_SummaryView.js';

/**
 * Подготавливает данные Summary из готовых снимков State.
 *
 * @param {Object} stateAtMessage — состояние текущего сообщения
 * @param {Object} previousState — состояние предыдущего сообщения
 * @returns {Object} Подготовленные данные для View
 */
export function preparePanelData(stateAtMessage, previousState) {
    return prepareSummaryData(stateAtMessage, previousState);
}

/**
 * Формирует HTML содержимого панели Summary.
 *
 * @param {Object} data — подготовленные данные для View
 * @param {Object} options — зависимости отображения
 * @param {Function} options.escapeHtml — экранирование HTML
 * @param {Function} options.t — локализация
 * @returns {string} HTML содержимого панели
 */
export function renderPanelContent(data, { settings, escapeHtml, t }) {
    return buildPanelContent(data, { settings, escapeHtml, t });
}