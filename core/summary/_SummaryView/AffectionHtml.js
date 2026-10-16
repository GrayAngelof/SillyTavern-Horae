// SillyTavern-Horae/core/summary/_SummaryView/AffectionHtml.js
/**
 * HTML-рендер панели привязанностей персонажей.
 *
 * Формирует строки редактора для каждого присутствующего персонажа:
 * имя, дельта, итоговое значение и кнопка удаления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит панель привязанностей для редактора.
 *
 * @param {Array} characters — список имён присутствующих персонажей
 * @param {Array} affectionEntries — записи привязанностей
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelAffection(
    characters,
    affectionEntries,
    { escapeHtml, t },
) {
    const presentCharacters = Array.isArray(characters)
        ? [...new Set(
            characters
                .map(name => String(name || '').trim())
                .filter(Boolean),
        )]
        : [];

    const affectionByChar = new Map(
        (Array.isArray(affectionEntries) ? affectionEntries : [])
            .filter(entry => entry && typeof entry === 'object')
            .map(entry => [String(entry.char ?? '').trim(), entry]),
    );

    const rows = presentCharacters.map(char => {
        const entry = affectionByChar.get(char) ?? {};

        return `
            <div class="horae-editor-row horae-affection-row"
                data-char="${escapeHtml(char)}"
                data-prev="${escapeHtml(entry.prevVal ?? '')}">
                <span class="horae-affection-char">${escapeHtml(char)}</span>
                <input type="text" class="horae-affection-delta"
                    value="${escapeHtml(entry.deltaStr ?? '')}"
                    placeholder="${t('placeholder.affectionDelta')}">
                <input type="number" class="horae-affection-total"
                    value="${escapeHtml(entry.totalStr ?? '')}"
                    placeholder="${t('placeholder.affectionTotal')}"
                    step="any">
                <button class="horae-delete-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join('');

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-heart"></i>
                ${t('characters.affection')}
            </label>
            <div class="horae-affection-editor">${rows}</div>
        </div>
    `;
}