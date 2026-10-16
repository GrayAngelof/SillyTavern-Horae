/**
 * Отрисовщик оболочки панели Summary.
 *
 * Создаёт и вставляет каркас панели сообщения.
 * Не получает данные из State и не формирует содержимое панели.
 */

import { buildMessagePanelHtml } from './_SummaryView.js';
import {
    renderPanelContent,
    preparePanelStyleData,
    preparePanelSummaryData,
    preparePanelTime,
    preparePanelSideplayData,
} from './_SummaryController.js';

/**
 * Создаёт функцию добавления панели Summary к сообщению чата.
 * Получает зависимости извне и использует их для формирования панели,
 * подключения обработчиков событий и обновления связанных элементов.
 */
export function createMessagePanelRenderer({
    horaeManager,
    getSettings,
    parseStoryDate,
    formatStoryDate,
    t,
    escapeHtml,
    bindPanelEvents,
    isLightMode,
    renderRpgHud,
    refreshHoraePorts,
}) {
    return function addMessagePanel(messageEl, messageIndex) {
        try {
            const existingPanel = messageEl.querySelector('.horae-message-panel');
            if (existingPanel) return;

            const meta = horaeManager.getMessageMeta(messageIndex);
            if (!meta) return;

            const settings = getSettings();
            const time = preparePanelTime(meta, parseStoryDate, formatStoryDate);
            const { eventSummary, charCount } = preparePanelSummaryData(meta, t);
            const { isSkipped, sideplayBtnStyle } =
                preparePanelSideplayData(meta, settings);
            const { layoutClass, dataLevel } =
                preparePanelStyleData(meta, settings);

            const contentHtml = renderPanelContent(messageIndex, meta, {
                horaeManager,
                settings,
                escapeHtml,
                t,
            });

            const panelHtml = buildMessagePanelHtml({
                messageIndex,
                isSkipped,
                layoutClass,
                dataLevel,
                time,
                eventSummary,
                charCount,
                sideplayBtnStyle,
                contentHtml,
                t,
            });

            const mesTextEl = messageEl.querySelector('.mes_text');
            if (!mesTextEl) return;

            mesTextEl.insertAdjacentHTML('afterend', panelHtml);

            const panelEl = messageEl.querySelector('.horae-message-panel');
            bindPanelEvents(panelEl);

            if (!settings.showMessagePanel && panelEl) {
                panelEl.style.display = 'none';
            }

            const width = Math.max(50, Math.min(100, settings.panelWidth || 100));
            if (width < 100 && panelEl) {
                panelEl.style.maxWidth = `${width}%`;
            }

            const offset = Math.max(0, settings.panelOffset || 0);
            if (offset > 0 && panelEl) {
                panelEl.style.marginLeft = `${offset}px`;
            }

            if (isLightMode() && panelEl) {
                panelEl.classList.add('horae-light');
            }

            renderRpgHud(messageEl, messageIndex);
            refreshHoraePorts(messageEl);
        } catch (err) {
            console.error(
                `[Horae] addMessagePanel #${messageIndex} 失败:`,
                err,
            );
        }
    };
}
