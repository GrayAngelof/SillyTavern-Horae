// SillyTavern-Horae/core/summary/_SummaryView/MoodHtml.js
/**
 * HTML-рендер панели настроения персонажей.
 *
 * Формирует строки редактора для каждого присутствующего персонажа:
 * имя, эмоция и кнопка удаления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит панель настроения для редактора.
 *
 * @param {Array} characters — список имён присутствующих персонажей
 * @param {Array} moodEntries — пары [имя персонажа, эмоция]
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelMood(
    characters,
    moodEntries,
    { escapeHtml, t },
) {
    const presentCharacters = Array.isArray(characters)
        ? [...new Set(
            characters
                .map(name => String(name || '').trim())
                .filter(Boolean),
        )]
        : [];

    const moodByChar = new Map(
        (Array.isArray(moodEntries) ? moodEntries : [])
            .filter(entry => Array.isArray(entry))
            .map(([char, emotion]) => [
                String(char || '').trim(),
                emotion ?? '',
            ]),
    );

    const rows = presentCharacters.map(char => `
        <div class="horae-editor-row horae-mood-row">
            <span class="mood-char">${escapeHtml(char)}</span>
            <input type="text" class="mood-emotion"
                   value="${escapeHtml(moodByChar.get(char) ?? '')}"
                   placeholder="${t('placeholder.moodState')}">
            <button class="horae-delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');

    return `
        <div class="horae-panel-row full-width">
            <label><i class="fa-solid fa-face-smile"></i> ${t('ui.moodLabel')}</label>
            <div class="horae-mood-editor">${rows}</div>
        </div>
    `;
}