// SillyTavern-Horae/core/summary/_SummaryView/DeletedItemsHtml.js
/**
 * HTML-рендер блока удалённых предметов.
 *
 * Формирует список тегов для аудита удалённых предметов.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок удалённых предметов.
 *
 * @param {Array} deletedItems — список названий удалённых предметов
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderDeletedItems(deletedItems, { escapeHtml, t }) {
    const entries = Array.isArray(deletedItems) ? deletedItems : [];

    const itemsHtml = entries.map(item => `
        <div class="horae-deleted-item-tag">
            <i class="fa-solid fa-xmark"></i> ${escapeHtml(item ?? '')}
        </div>
    `).join('');

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-trash-can"></i>
                ${t('items.deletedItems')}
            </label>
            <div class="horae-deleted-items-display">${itemsHtml}</div>
        </div>
    `;
}