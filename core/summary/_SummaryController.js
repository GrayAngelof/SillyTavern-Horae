// SillyTavern-Horae/core/summary/_SummaryController.js
/**
 * Контроллер подсистемы Summary.
 *
 * Координирует подготовку данных, формирование HTML
 * и передачу разметки рендереру для отображения.
 *
 * Не обращается к истории сообщений и не управляет DOM.
 *
 * Внутренний модуль. Внешний код должен обращаться к контроллеру
 * через публичный фасад core/summary.js.
 */

// ===== ИМПОРТЫ =====
import { renderMessagePanel } from './_SummaryDomRenderer.js';
import { preparePanelData } from './_SummaryStateService.js';
import { buildPanelHtml } from './_SummaryView.js';


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Координирует подготовку и отображение панели Summary.
 *
 * @param {Object} stateAtMessage — состояние текущего сообщения
 * @param {Object} previousState — состояние предыдущего сообщения
 * @param {Object} options — параметры отображения панели
 * @param {Element} options.messageEl — DOM-элемент сообщения
 * @param {number} options.messageIndex — индекс сообщения
 * @param {Object} options.rendererDependencies — зависимости DOM-рендерера
 * @param {Object} options.settings — настройки отображения панели
 * @param {Function} options.escapeHtml — функция экранирования HTML
 * @param {Function} options.t — функция локализации
 */
export function renderSummary(stateAtMessage, previousState, {
    messageEl,
    messageIndex,
    rendererDependencies,
    ...viewOptions
}) {
    const data = preparePanelData(stateAtMessage, previousState);
    const panelHtml = buildPanelHtml(data, viewOptions);

    renderMessagePanel(
        messageEl,
        messageIndex,
        panelHtml,
        rendererDependencies,
    );
}