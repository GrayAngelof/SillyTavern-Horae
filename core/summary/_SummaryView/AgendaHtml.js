// SillyTavern-Horae/core/summary/_SummaryView/AgendaHtml.js
/**
 * HTML-рендер блока повестки (agenda).
 *
 * Формирует строки редактора для каждой задачи:
 * дата, текст и кнопка удаления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок повестки для редактора.
 *
 * @param {Array} agenda — список задач
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelAgenda(agenda, { escapeHtml, t }) {
    const entries = Array.isArray(agenda) ? agenda : [];

    const rows = entries.map(item => `
        <div class="horae-editor-row horae-agenda-edit-row">
            <input type="text" class="horae-agenda-date"
                   style="flex:0 0 90px;max-width:90px;"
                   value="${escapeHtml(item?.date ?? '')}"
                   placeholder="${t('label.date')}">
            <input type="text" class="horae-agenda-text"
                   style="flex:1 1 0;min-width:0;"
                   value="${escapeHtml(item?.text ?? '')}"
                   placeholder="${t('placeholder.agendaContentHint')}">
            <button class="horae-delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-list-check"></i>
                ${t('timeline.agenda')}
            </label>
            <div class="horae-agenda-editor">${rows}</div>
        </div>
    `;
}