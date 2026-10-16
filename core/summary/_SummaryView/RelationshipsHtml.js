// SillyTavern-Horae/core/summary/_SummaryView/RelationshipsHtml.js
/**
 * HTML-рендер блока социальных отношений.
 *
 * Формирует список направленных связей между персонажами в формате:
 * "от → к: тип (заметка)".
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок социальных отношений.
 *
 * @param {Array} rels — список связей [{from, to, type, note}]
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка блока
 */
export function renderPanelRelationships(rels, { escapeHtml, t }) {
    const entries = Array.isArray(rels) ? rels : [];

    const rows = entries.map(rel => {
        const relationship = rel && typeof rel === 'object' && !Array.isArray(rel)
            ? rel
            : {};

        const noteStr = relationship.note
            ? ` <span class="horae-rel-note-sm">(${escapeHtml(relationship.note)})</span>`
            : '';

        return `
            <div class="horae-panel-rel-row">
                ${escapeHtml(relationship.from ?? '')}
                <span class="horae-rel-arrow-sm">→</span>
                ${escapeHtml(relationship.to ?? '')}:
                <strong>${escapeHtml(relationship.type ?? '')}</strong>${noteStr}
            </div>
        `;
    }).join('');

    return `
        <div class="horae-panel-row full-width">
            <label><i class="fa-solid fa-diagram-project"></i> ${t('characters.relationships')}</label>
            <div class="horae-panel-relationships">${rows}</div>
        </div>
    `;
}