// SillyTavern-Horae/core/summary/_SummaryView/TimestampHtml.js
/**
 * HTML-рендер блока временной метки.
 *
 * Поддерживает два формата:
 * - строку (уже отформатированную)
 * - объект {story_date, story_time} — объединяет в строку через пробел
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок временной метки.
 *
 * @param {string|Object} timestamp — значение временной метки
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderPanelTimestamp(timestamp, { escapeHtml, t }) {
    const value = typeof timestamp === 'string'
        ? timestamp
        : [
            timestamp?.story_date,
            timestamp?.story_time,
        ].filter(Boolean).join(' ');

    return `
        <div class="horae-panel-row">
            <label><i class="fa-regular fa-clock"></i> ${t('label.time')}</label>
            <div class="horae-panel-value">
                <input type="text"
                       class="horae-input-datetime"
                       placeholder="${t('placeholder.dateTime')}"
                       value="${escapeHtml(value)}">
            </div>
        </div>
    `;
}