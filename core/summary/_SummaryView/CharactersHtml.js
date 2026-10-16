// SillyTavern-Horae/core/summary/_SummaryView/CharactersHtml.js
/**
 * HTML-рендер блока присутствующих персонажей.
 *
 * Формирует однострочный редактор для ввода списка персонажей.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок присутствующих персонажей.
 *
 * @param {string} characters — значение поля персонажей
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderPanelCharacters(characters, { escapeHtml, t }) {
    return `
        <div class="horae-panel-row">
            <label><i class="fa-solid fa-users"></i> ${t('characters.present')}</label>
            <div class="horae-panel-value">
                <input type="text"
                       class="horae-input-characters"
                       value="${escapeHtml(characters ?? '')}"
                       placeholder="${t('placeholder.charactersSeparated')}">
            </div>
        </div>
    `;
}