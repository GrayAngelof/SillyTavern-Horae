// SillyTavern-Horae/core/summary/_SummaryView/LocationHtml.js
/**
 * HTML-рендер блока местоположения.
 *
 * Формирует однострочный редактор для ввода локации.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок местоположения.
 *
 * @param {string} location — значение локации
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderPanelLocation(location, { escapeHtml, t }) {
    return `
        <div class="horae-panel-row">
            <label><i class="fa-solid fa-location-dot"></i> ${t('label.location')}</label>
            <div class="horae-panel-value">
                <input type="text"
                       class="horae-input-location"
                       value="${escapeHtml(location ?? '')}"
                       placeholder="${t('label.location')}">
            </div>
        </div>
    `;
}