// SillyTavern-Horae/core/summary/_SummaryView/CostumeEditorHtml.js
/**
 * HTML-рендер панели костюмов персонажей.
 *
 * Формирует строки редактора для каждого присутствующего персонажа:
 * имя, костюм и кнопка удаления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит панель костюмов для редактора.
 *
 * @param {Array} characters — список имён присутствующих персонажей
 * @param {Array} costumeEntries — пары [имя персонажа, костюм]
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelCostumes(
    characters,
    costumeEntries,
    { escapeHtml, t },
) {
    const presentCharacters = Array.isArray(characters)
        ? [...new Set(
            characters
                .map(name => String(name || '').trim())
                .filter(Boolean),
        )]
        : [];

    const costumes = new Map(
        (Array.isArray(costumeEntries) ? costumeEntries : [])
            .filter(entry => Array.isArray(entry))
            .map(([char, costume]) => [
                String(char || '').trim(),
                String(costume ?? ''),
            ]),
    );

    const rows = presentCharacters.map(char => `
        <div class="horae-editor-row">
            <input type="text" class="char-input"
                   value="${escapeHtml(char)}"
                   placeholder="${t('placeholder.holderName')}">
            <input type="text"
                   value="${escapeHtml(costumes.get(char) ?? '')}"
                   placeholder="${t('placeholder.costumeDesc')}">
            <button class="horae-delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-shirt"></i>
                ${t('status.costumes')}
            </label>
            <div class="horae-costume-editor">${rows}</div>
        </div>
    `;
}