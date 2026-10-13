
/**
 * Публичный интерфейс подсистемы Summary.
 * Внутренняя реализация находится в ./summary/.
 */

import { renderPanelContent } from './summary/_SummaryController.js';
import { getAffectionTotals } from './summary/_SummaryStateService.js';
import { buildDeletedItemsDisplay } from './summary/_SummaryView.js';
import { buildAgendaEditorRows } from './summary/_SummaryView.js';
import { buildPanelMoodEditable } from './summary/_SummaryView.js';
import { getPanelRelationships } from './summary/_SummaryStateService.js';
import { buildPanelRelationships } from './summary/_SummaryView.js';
import { getPanelCostumeAndItemData } from './summary/_SummaryStateService.js';
import { getPanelAffectionData } from './summary/_SummaryStateService.js';
import { getPanelAgendaData } from './summary/_SummaryStateService.js';

export { buildPanelContent } from './summary/_SummaryView.js';
export { buildDeletedItemsDisplay };
export { buildAgendaEditorRows };
export { buildPanelMoodEditable };
export { buildPanelRelationships };

/**
 * Публичный фасад подсистемы Summary.
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
    // Добавляет панель метаданных под сообщением.
    return function addMessagePanel(messageEl, messageIndex) {
        try {
            const existingPanel = messageEl.querySelector('.horae-message-panel');
            if (existingPanel) return;
            const meta = horaeManager.getMessageMeta(messageIndex);
            if (!meta) return;
            const settings = getSettings();
            let time = '--';
            if (meta.timestamp?.story_date) {
                const parsed = parseStoryDate(meta.timestamp.story_date);
                if (parsed && parsed.type === 'standard') {
                    time = formatStoryDate(parsed, true);
                } else {
                    time = meta.timestamp.story_date;
                }
                if (meta.timestamp.story_time) {
                    time += ' ' + meta.timestamp.story_time;
                }
            }

            const eventsArr = meta.events || (meta.event ? [meta.event] : []);
            const eventSummary = eventsArr.length > 0
                ? eventsArr.map(e => e.summary).join(' | ')
                : t('ui.noSpecialEvents');
            const charCount = meta.scene?.characters_present?.length || 0;
            const isSkipped = !!meta._skipHorae;
            const sideplayBtnStyle = settings.sideplayMode ? '' : 'display:none;';
            const firstLevel = (eventsArr.find(e => e && e.level)?.level || '').trim();
            const levelMap = {
                '一般': 'normal',
                '重要': 'important',
                '关键': 'critical',
                '關鍵': 'critical',
            };
            const dataLevel = levelMap[firstLevel] || (firstLevel ? 'normal' : '');
            const layoutClass = settings.panelLayoutStyle === 'glass'
                ? ' horae-layout-glass'
                : settings.panelLayoutStyle === 'obsidian'
                    ? ' horae-layout-obsidian'
                    : settings.panelLayoutStyle === 'cyber'
                        ? ' horae-layout-cyber'
                        : '';
            const panelHtml = `
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
                        ${renderPanelContent(messageIndex, meta, {
                            horaeManager,
                            settings,
                            escapeHtml,
                            t,
                        })}
                    </div>
                </div>
            `;
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
            console.error(`[Horae] addMessagePanel #${messageIndex} 失败:`, err);
        }
    };
}