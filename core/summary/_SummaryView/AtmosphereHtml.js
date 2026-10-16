// SillyTavern-Horae/core/summary/_SummaryView/AtmosphereHtml.js
/**
 * HTML-рендер блока атмосферы сцены.
 *
 * Формирует однострочный редактор для ввода атмосферы.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок атмосферы сцены.
 *
 * @param {string} atmosphere — значение атмосферы
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderPanelAtmosphere(atmosphere, { escapeHtml, t }) {
    return `
        <div class="horae-panel-row">
            <label><i class="fa-solid fa-cloud"></i> ${t('label.atmosphere')}</label>
            <div class="horae-panel-value">
                <input type="text"
                       class="horae-input-atmosphere"
                       value="${escapeHtml(atmosphere ?? '')}"
                       placeholder="${t('label.atmosphere')}">
            </div>
        </div>
    `;
}