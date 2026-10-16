// SillyTavern-Horae/core/summary/_SummaryView/ItemsHtml.js
/**
 * HTML-рендер редактора предметов.
 *
 * Формирует строки редактора для каждого предмета:
 * иконка, название, владелец, локация, описание и кнопка удаления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Рендерит HTML-блок редактора предметов.
 *
 * @param {Object} itemsAtMessage — словарь предметов {имя: {icon, holder, location, description}}
 * @param {Object} deps — зависимости
 * @param {Function} deps.escapeHtml — функция экранирования HTML
 * @param {Function} deps.t — функция локализации
 * @returns {string} HTML-разметка панели
 */
export function renderPanelItems(itemsAtMessage, { escapeHtml, t }) {
    const items = (
        itemsAtMessage &&
        typeof itemsAtMessage === 'object' &&
        !Array.isArray(itemsAtMessage)
    ) ? itemsAtMessage : {};

    const rows = Object.entries(items).map(([name, info]) => {
        const item = info && typeof info === 'object' && !Array.isArray(info)
            ? info
            : {};

        return `
            <div class="horae-editor-row horae-item-row">
                <input type="text" class="horae-item-icon"
                       value="${escapeHtml(item.icon ?? '')}"
                       placeholder="📦" maxlength="2">
                <input type="text" class="horae-item-name"
                       value="${escapeHtml(name)}"
                       placeholder="${t('placeholder.itemName')}">
                <input type="text" class="horae-item-holder"
                       value="${escapeHtml(item.holder ?? '')}"
                       placeholder="${t('label.holder')}">
                <input type="text" class="horae-item-location"
                       value="${escapeHtml(item.location ?? '')}"
                       placeholder="${t('label.location')}">
                <button class="horae-delete-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="horae-editor-row horae-item-desc-row">
                <input type="text" class="horae-item-description"
                       value="${escapeHtml(item.description ?? '')}"
                       placeholder="${t('placeholder.itemDesc')}">
            </div>
        `;
    }).join('');

    return `
        <div class="horae-panel-row full-width">
            <label>
                <i class="fa-solid fa-box-open"></i>
                ${t('status.itemTracking')}
            </label>
            <div class="horae-items-editor">${rows}</div>
        </div>
    `;
}