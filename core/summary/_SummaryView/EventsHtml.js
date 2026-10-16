// SillyTavern-Horae/core/summary/_SummaryView/EventsHtml.js
/**
 * HTML-рендер редактора событий.
 *
 * Формирует панель с выбором уровня события и полем ввода описания.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок редактора событий.
 *
 * @param {Object} data — данные события
 * @param {string} data.eventLevel — уровень события (一般 | 重要 | 关键/關鍵)
 * @param {string} data.eventSummary — описание события
 * @param {boolean} data.hasMultipleEvents — есть ли несколько событий
 * @param {string} data.multipleEventsNoteText — текст заметки о множественных событиях
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelEvents({
    eventLevel,
    eventSummary,
    hasMultipleEvents,
    multipleEventsNoteText,
}, { escapeHtml, t }) {
    const eventNormalSelected = eventLevel === '一般' ? 'selected' : '';
    const eventImportantSelected = eventLevel === '重要' ? 'selected' : '';
    const eventCriticalSelected =
        eventLevel === '关键' || eventLevel === '關鍵'
            ? 'selected'
            : '';

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-bookmark"></i>
                ${t('timeline.events')}
                ${hasMultipleEvents
                    ? `<span class="horae-note">${escapeHtml(multipleEventsNoteText ?? '')}</span>`
                    : ''}
            </label>
            <div class="horae-event-editor">
                <select class="horae-input-event-level">
                    <option value="">${t('levels.none')}</option>
                    <option value="一般" ${eventNormalSelected}>${t('levels.normal')}</option>
                    <option value="重要" ${eventImportantSelected}>${t('levels.important')}</option>
                    <option value="关键" ${eventCriticalSelected}>${t('levels.critical')}</option>
                </select>
                <input type="text"
                       class="horae-input-event-summary"
                       value="${escapeHtml(eventSummary ?? '')}"
                       placeholder="${t('placeholder.eventSummary')}">
            </div>
        </div>
    `;
}