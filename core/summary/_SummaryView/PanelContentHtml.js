// SillyTavern-Horae/core/summary/_SummaryView/PanelContentHtml.js
/**
 * HTML-рендер основного содержимого панели Summary.
 *
 * Собирает готовые HTML-блоки в единую сетку с блоками
 * пересканирования и нижней панелью управления.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Формирует HTML основного содержимого панели Summary.
 *
 * @param {Object} blocks — готовые HTML-блоки панелей
 * @param {string} blocks.timestampHtml — блок временной метки
 * @param {string} blocks.locationHtml — блок местоположения
 * @param {string} blocks.atmosphereHtml — блок атмосферы
 * @param {string} blocks.charactersHtml — блок присутствующих персонажей
 * @param {string} blocks.costumeHtml — блок костюмов
 * @param {string} blocks.moodHtml — блок настроения
 * @param {string} blocks.itemHtml — блок предметов
 * @param {string} blocks.deletedItemsHtml — блок удалённых предметов
 * @param {string} blocks.eventsHtml — блок событий
 * @param {string} blocks.affectionHtml — блок привязанностей
 * @param {string} blocks.agendaHtml — блок повестки
 * @param {string} blocks.relationshipsHtml — блок отношений
 * @param {Function} blocks.t — функция локализации
 * @returns {string} HTML-разметка содержимого панели
 */
export function renderPanelContentHtml({
    timestampHtml,
    locationHtml,
    atmosphereHtml,
    charactersHtml,
    costumeHtml,
    moodHtml,
    itemHtml,
    deletedItemsHtml,
    eventsHtml,
    affectionHtml,
    agendaHtml,
    relationshipsHtml,
    t,
}) {
    return `
        <div class="horae-panel-grid">
            ${timestampHtml}
            ${locationHtml}
            ${atmosphereHtml}
            ${charactersHtml}
            ${costumeHtml}
            ${moodHtml}
            ${itemHtml}
            ${deletedItemsHtml}
            ${eventsHtml}
            ${affectionHtml}
            ${agendaHtml}
            ${relationshipsHtml}
        </div>
        <div class="horae-panel-rescan">
            <div class="horae-rescan-label"><i class="fa-solid fa-rotate"></i> ${t('ui.rescanMessage')}</div>
            <div class="horae-rescan-buttons">
                <button class="horae-btn-quick-scan horae-btn" title="${t('ui.quickScanTitle')}">
                    <i class="fa-solid fa-bolt"></i> ${t('tooltip.quickScan')}
                </button>
                <button class="horae-btn-ai-analyze horae-btn" title="${t('ui.aiAnalyzeTitle')}">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> ${t('tooltip.aiAnalysis')}
                </button>
            </div>
        </div>
        <div class="horae-panel-footer">
            <button class="horae-btn-save horae-btn"><i class="fa-solid fa-check"></i> ${t('common.save')}</button>
            <button class="horae-btn-cancel horae-btn"><i class="fa-solid fa-xmark"></i> ${t('common.cancel')}</button>
            <button class="horae-btn-open-drawer horae-btn" title="${t('tooltip.openPanel')}"><i class="fa-solid fa-clock-rotate-left"></i></button>
        </div>
    `;
}