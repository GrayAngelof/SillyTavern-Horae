// SillyTavern-Horae/core/summary/_SummaryView/MessagePanelHtml.js
/**
 * HTML-рендер оболочки панели Summary для одного сообщения чата.
 *
 * Содержит шапку панели (иконка, сводка, действия) и скрытый
 * контейнер содержимого, который раскрывается по клику.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Формирует HTML оболочки панели Summary для сообщения чата.
 *
 * @param {Object} params — параметры панели
 * @param {number} params.messageIndex — индекс сообщения
 * @param {boolean} params.isSkipped — пропущено ли сообщение (sideplay)
 * @param {string} params.layoutClass — CSS-класс раскладки
 * @param {string} params.dataLevel — уровень события
 * @param {string} params.time — время
 * @param {string} params.eventSummary — описание события
 * @param {number} params.charCount — количество персонажей
 * @param {string} params.sideplayBtnStyle — стиль кнопки sideplay
 * @param {string} params.contentHtml — готовый HTML-контент (скрыт до раскрытия)
 * @param {Function} params.t — функция локализации
 * @returns {string} HTML-разметка панели сообщения
 */
export function renderMessagePanelHtml({
    messageIndex,
    isSkipped,
    layoutClass,
    dataLevel,
    time,
    eventSummary,
    charCount,
    sideplayBtnStyle,
    contentHtml = '',
    t,
}) {
    return `
        <div class="horae-message-panel${isSkipped ? ' horae-sideplay' : ''}${layoutClass}"
             data-message-id="${messageIndex}"${dataLevel ? ` data-level="${dataLevel}"` : ''}>
            <div class="horae-panel-toggle">
                <div class="horae-panel-icon">
                    <i class="fa-regular ${isSkipped ? 'fa-eye-slash' : 'fa-clock'}"></i>
                </div>
                <div class="horae-panel-summary">
                    ${isSkipped ? `<span class="horae-sideplay-badge">${t('badge.sideplay')}</span>` : ''}
                    <span class="horae-summary-time">${isSkipped ? t('badge.noTracking') : time}</span>
                    <span class="horae-summary-divider">|</span>
                    <span class="horae-summary-event">${isSkipped ? t('badge.sideplayMarked') : eventSummary}</span>
                    <span class="horae-summary-divider">|</span>
                    <span class="horae-summary-chars">${isSkipped ? '' : charCount + ' ' + t('characters.present')}</span>
                </div>
                <div class="horae-panel-actions">
                    <button class="horae-btn-sideplay"
                            title="${t('tooltip.sideplayMark')}"
                            style="${sideplayBtnStyle}">
                        <i class="fa-solid ${isSkipped ? 'fa-eye' : 'fa-masks-theater'}"></i>
                    </button>
                    <button class="horae-btn-rescan" title="${t('tooltip.rescan')}">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                    <button class="horae-btn-ai-analyze-header" title="${t('ui.aiAnalyzeTitle')}">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                </div>
            </div>
            <div class="horae-panel-content" style="display: none;">
                ${contentHtml}
            </div>
        </div>
    `;
}