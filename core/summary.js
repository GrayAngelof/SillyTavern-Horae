
/**
 * Публичный интерфейс подсистемы Summary.
 * Внутренняя реализация находится в ./summary/.
 */

//import { getAffectionTotals } from './summary/_SummaryStateService.js';

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
    /**
     * Добавляет панель метаданных под сообщением.
     */
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
                        ${buildPanelContent(messageIndex, meta, {
                            horaeManager,
                            settings: getSettings(),
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


/**
 * Формирует HTML удалённых предметов.
 */
export function buildDeletedItemsDisplay(deletedItems) {
    if (!deletedItems || deletedItems.length === 0) {
        return '';
    }

    return deletedItems.map(item => `
        <div class="horae-deleted-item-tag">
            <i class="fa-solid fa-xmark"></i> ${item}
        </div>
    `).join('');
}

/**
 * Формирует строки редактора задач.
 */
export function buildAgendaEditorRows(agenda, { escapeHtml, t }) {
    if (!agenda || agenda.length === 0) {
        return '';
    }

    return agenda.map(item => `
        <div class="horae-editor-row horae-agenda-edit-row">
            <input type="text" class="horae-agenda-date"
                   style="flex:0 0 90px;max-width:90px;"
                   value="${escapeHtml(item.date || '')}"
                   placeholder="${t('label.date')}">
            <input type="text" class="horae-agenda-text"
                   style="flex:1 1 0;min-width:0;"
                   value="${escapeHtml(item.text || '')}"
                   placeholder="${t('placeholder.agendaContentHint')}">
            <button class="horae-delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Формирует отображение социальных отношений персонажей.
 */
export function buildPanelRelationships(meta, { settings, horaeManager, t }) {
    if (!settings.sendRelationships) return '';

    const presentChars = meta.scene?.characters_present || [];
    const rels = horaeManager.getRelationshipsForCharacters(presentChars);

    if (rels.length === 0) return '';

    const rows = rels.map(r => {
        const noteStr = r.note
            ? ` <span class="horae-rel-note-sm">(${r.note})</span>`
            : '';

        return `<div class="horae-panel-rel-row">${r.from} <span class="horae-rel-arrow-sm">→</span> ${r.to}: <strong>${r.type}</strong>${noteStr}</div>`;
    }).join('');

    return `
        <div class="horae-panel-row full-width">
            <label><i class="fa-solid fa-diagram-project"></i> ${t('characters.relationships')}</label>
            <div class="horae-panel-relationships">${rows}</div>
        </div>`;
}

/**
 * Формирует редактор настроения персонажей.
 */
export function buildPanelMoodEditable(meta, { settings, escapeHtml, t }) {
    if (!settings.sendMood) return '';

    const moodEntries = Object.entries(meta.mood || {});

    const rows = moodEntries.map(([char, emotion]) => `
        <div class="horae-editor-row horae-mood-row">
            <span class="mood-char">${escapeHtml(char)}</span>
            <input type="text" class="mood-emotion"
                   value="${escapeHtml(emotion)}"
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
            <button class="horae-btn-add-mood">
                <i class="fa-solid fa-plus"></i> ${t('common.add')}
            </button>
        </div>`;
}

/**
 * 构建已删除物品显示
 */


/**
 * 构建待办事项编辑行
 */


/** 关系网络面板渲染 — 数据源为 chat[0].horae_meta，不消耗 AI 输出 */



export function buildPanelContent(messageIndex, meta, {
    horaeManager,
    settings,
    escapeHtml,
    t,
}) {

    const chatForCostumes = horaeManager.getChat();
    const skipLast = Math.max(0, chatForCostumes.length - messageIndex - 1);
    const stateAtMessage = horaeManager.getLatestState(skipLast);
    const presentChars = meta.scene?.characters_present || [];
    const allCostumes = stateAtMessage.costumes || {};

    const findCostume = (name) => {
        if (allCostumes[name]) return allCostumes[name];

        const normalized = name.trim().toLowerCase();
        const match = Object.entries(allCostumes).find(
            ([char]) => char.trim().toLowerCase() === normalized
        );

        return match?.[1] || '';
    };

    const costumeEntries = presentChars.length > 0
        ? presentChars.map(char => [char, findCostume(char)])
        : Object.entries(meta.costumes || {});

    const costumeRows = costumeEntries.map(([char, costume]) => `
        <div class="horae-editor-row">
            <input type="text" class="char-input" value="${escapeHtml(char)}" placeholder="${t('placeholder.holderName')}">
            <input type="text" value="${escapeHtml(costume)}" placeholder="${t('placeholder.costumeDesc')}">
            <button class="horae-delete-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `).join('');

    // 物品分类由主页面管理，底部栏不显示
        const chatForItems = horaeManager.getChat();
        const skipLastForItems = Math.max(0, chatForItems.length - messageIndex - 1);
        const itemsAtMessage = horaeManager.getLatestState(skipLastForItems).items || {};

        const itemRows = Object.entries(itemsAtMessage).map(([name, info]) => {
        return `
            <div class="horae-editor-row horae-item-row">
                <input type="text" class="horae-item-icon" value="${escapeHtml(info.icon || '')}" placeholder="📦" maxlength="2">
                <input type="text" class="horae-item-name" value="${escapeHtml(name)}" placeholder="${t('placeholder.itemName')}">
                <input type="text" class="horae-item-holder" value="${escapeHtml(info.holder || '')}" placeholder="${t('label.holder')}">
                <input type="text" class="horae-item-location" value="${escapeHtml(info.location || '')}" placeholder="${t('label.location')}">
                <button class="horae-delete-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="horae-editor-row horae-item-desc-row">
                <input type="text" class="horae-item-description" value="${escapeHtml(info.description || '')}" placeholder="${t('placeholder.itemDesc')}">
            </div>
        `;
    }).join('');

    // 获取前一条消息的好感总值（使用缓存避免 O(n²) 重复遍历）
    const prevTotals = {};
    const chat = horaeManager.getChat();
    if (!buildPanelContent._affCache || buildPanelContent._affCacheLen !== chat.length) {
        buildPanelContent._affCache = [];
        buildPanelContent._affCacheLen = chat.length;
        const running = {};
        for (let i = 0; i < chat.length; i++) {
            const m = chat[i]?.horae_meta;
            if (m?.affection) {
                for (const [k, v] of Object.entries(m.affection)) {
                    let val = 0;
                    if (typeof v === 'object' && v !== null) {
                        if (v.type === 'absolute') val = parseFloat(v.value) || 0;
                        else if (v.type === 'relative') val = (running[k] || 0) + (parseFloat(v.value) || 0);
                    } else {
                        val = (running[k] || 0) + (parseFloat(v) || 0);
                    }
                    running[k] = val;
                }
            }
            buildPanelContent._affCache[i] = { ...running };
        }
    }
    if (messageIndex > 0 && buildPanelContent._affCache[messageIndex - 1]) {
        Object.assign(prevTotals, buildPanelContent._affCache[messageIndex - 1]);
    }


    const currentTotals = buildPanelContent._affCache[messageIndex] || {};
    const affectionPresentChars  = meta.scene?.characters_present || [];
    const affectionKeys = [...new Set([
        ...affectionPresentChars ,
        ...Object.keys(meta.affection || {})
    ])];

    const findAffectionKey = (name, values) => {
        if (Object.prototype.hasOwnProperty.call(values, name)) return name;
        const normalized = name.trim().toLowerCase();
        return Object.keys(values).find(
            key => key.trim().toLowerCase() === normalized
        );
    };

    const affectionRows = affectionKeys.map(char => {
        const key = findAffectionKey(char, {
            ...prevTotals,
            ...currentTotals,
            ...(meta.affection || {})
        }) || char;

        const value = meta.affection?.[key];
        const hasCurrent = value !== undefined;
        const hasTotal = Object.prototype.hasOwnProperty.call(
            currentTotals, key
        );

        const prevVal = prevTotals[key] || 0;
        let deltaStr = '';
        let totalStr = '';

        if (hasCurrent) {
            let delta = 0;
            let newTotal = 0;

            if (typeof value === 'object' && value !== null) {
                if (value.type === 'absolute') {
                    newTotal = parseFloat(value.value) || 0;
                    delta = newTotal - prevVal;
                } else if (value.type === 'relative') {
                    delta = parseFloat(value.value) || 0;
                    newTotal = prevVal + delta;
                }
            } else {
                delta = parseFloat(value) || 0;
                newTotal = prevVal + delta;
            }

            delta = Math.round(delta * 100) / 100;
            newTotal = Math.round(newTotal * 100) / 100;
            deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
            totalStr = `${newTotal}`;
        } else if (hasTotal) {
            totalStr = `${Math.round(currentTotals[key] * 100) / 100}`;
            deltaStr = '+0';
        }

        return `
            <div class="horae-editor-row horae-affection-row"
                 data-char="${escapeHtml(char)}"
                 data-prev="${prevTotals[key] || 0}">
                <span class="horae-affection-char">${escapeHtml(char)}</span>
                <input type="text" class="horae-affection-delta"
                       value="${deltaStr}"
                       placeholder="${t('placeholder.affectionDelta')}">
                <input type="number" class="horae-affection-total"
                       value="${totalStr}"
                       placeholder="${t('placeholder.affectionTotal')}"
                       step="any">
                <button class="horae-delete-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join('');

    // 兼容新旧事件格式
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);
    const firstEvent = eventsArr[0] || {};
    const eventLevel = firstEvent.level || '';
    const eventSummary = firstEvent.summary || '';
    const multipleEventsNote = eventsArr.length > 1 ? `<span class="horae-note">${t('ui.multipleEventsNote', { n: eventsArr.length })}</span>` : '';


    // Собираем активную агенду по истории до выбранного сообщения.
    const agendaForPanel = (() => {
        const active = new Map();

        for (let i = 0; i <= messageIndex && i < chat.length; i++) {
            const message = chat[i];
            const rawText = message?.mes || '';
            const storedMeta = message?.horae_meta;
            const parsedMeta = horaeManager.parseHoraeTag(rawText);

            // Сначала учитываем задачи, добавленные на этом ходу.
            const added = [
                ...(Array.isArray(storedMeta?.agenda) ? storedMeta.agenda : []),
                ...(Array.isArray(parsedMeta?.agenda) ? parsedMeta.agenda : [])
            ];

            for (const item of added) {
                const text = String(item?.text || '').trim();
                if (text) {
                    active.set(text, item);
                }
            }

            // Затем удаляем задачи по тегу agenda-.

            // Парсер Horae сохраняет agenda- в deletedAgenda.
            const removed = [
                ...(Array.isArray(storedMeta?.deletedAgenda)
                    ? storedMeta.deletedAgenda
                    : []),
                ...(Array.isArray(parsedMeta?.deletedAgenda)
                    ? parsedMeta.deletedAgenda
                    : [])
            ];

            for (const item of removed) {
                const text = String(
                    typeof item === 'string' ? item : item?.text || ''
                ).trim();

                if (!text) continue;

                // Допускаем небольшие различия в формулировках.
                for (const [key, value] of active.entries()) {
                    const existingText = String(value?.text || key).trim();

                    if (
                        existingText === text ||
                        existingText.includes(text) ||
                        text.includes(existingText)
                    ) {
                        active.delete(key);
                    }
                }
            }

            // Резервное извлечение удалений непосредственно из текста.
            const removalRegex = /(?:^|\n)\s*\**agenda-\s*:\s*(.+?)\**\s*(?=\n|$)/g;
            for (const match of rawText.matchAll(removalRegex)) {
                const text = match[1].trim().replace(/\*\*/g, '');
                if (text) active.delete(text);
            }
        }

        return [...active.values()];
    })();
    return `
        <div class="horae-panel-grid">
            <div class="horae-panel-row">
                <label><i class="fa-regular fa-clock"></i> ${t('label.time')}</label>
                <div class="horae-panel-value">
                    <input type="text" class="horae-input-datetime" placeholder="${t('placeholder.dateTime')}" value="${escapeHtml((() => {
        let val = meta.timestamp?.story_date || '';
        if (meta.timestamp?.story_time) val += (val ? ' ' : '') + meta.timestamp.story_time;
        return val;
    })())}">
                </div>
            </div>
            <div class="horae-panel-row">
                <label><i class="fa-solid fa-location-dot"></i> ${t('label.location')}</label>
                <div class="horae-panel-value">
                    <input type="text" class="horae-input-location" value="${escapeHtml(meta.scene?.location || '')}" placeholder="${t('label.location')}">
                </div>
            </div>
            <div class="horae-panel-row">
                <label><i class="fa-solid fa-cloud"></i> ${t('label.atmosphere')}</label>
                <div class="horae-panel-value">
                    <input type="text" class="horae-input-atmosphere" value="${escapeHtml(meta.scene?.atmosphere || '')}" placeholder="${t('label.atmosphere')}">
                </div>
            </div>
            <div class="horae-panel-row">
                <label><i class="fa-solid fa-users"></i> ${t('characters.present')}</label>
                <div class="horae-panel-value">
                    <input type="text" class="horae-input-characters" value="${escapeHtml((meta.scene?.characters_present || []).join(', '))}" placeholder="${t('placeholder.charactersSeparated')}">
                </div>
            </div>
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-shirt"></i> ${t('status.costumes')}</label>
                <div class="horae-costume-editor">${costumeRows}</div>
                <button class="horae-btn-add-costume"><i class="fa-solid fa-plus"></i> ${t('common.add')}</button>
            </div>
            ${buildPanelMoodEditable(meta, {
                settings,
                escapeHtml,
                t,
            })}
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-box-open"></i> ${t('status.itemTracking')}</label>
                <div class="horae-items-editor">${itemRows}</div>
                <button class="horae-btn-add-item"><i class="fa-solid fa-plus"></i> ${t('common.add')}</button>
            </div>
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-trash-can"></i> ${t('items.deletedItems')}</label>
                <div class="horae-deleted-items-display">${buildDeletedItemsDisplay(meta.deletedItems)}</div>
            </div>
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-bookmark"></i> ${t('timeline.events')} ${multipleEventsNote}</label>
                <div class="horae-event-editor">
                    <select class="horae-input-event-level">
                        <option value="">${t('levels.none')}</option>
                        <option value="一般" ${eventLevel === '一般' ? 'selected' : ''}>${t('levels.normal')}</option>
                        <option value="重要" ${eventLevel === '重要' ? 'selected' : ''}>${t('levels.important')}</option>
                        <option value="关键" ${eventLevel === '关键' || eventLevel === '關鍵' ? 'selected' : ''}>${t('levels.critical')}</option>
                    </select>
                    <input type="text" class="horae-input-event-summary" value="${escapeHtml(eventSummary)}" placeholder="${t('placeholder.eventSummary')}">
                </div>
            </div>
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-heart"></i> ${t('characters.affection')}</label>
                <div class="horae-affection-editor">${affectionRows}</div>
                <button class="horae-btn-add-affection"><i class="fa-solid fa-plus"></i> ${t('common.add')}</button>
            </div>
            <div class="horae-panel-row full-width">
                <label><i class="fa-solid fa-list-check"></i> ${t('timeline.agenda')}</label>
                <div class="horae-agenda-editor">
                    ${buildAgendaEditorRows(agendaForPanel, {
                        escapeHtml,
                        t,
                    })}
                </div>
                <button class="horae-btn-add-agenda-row"><i class="fa-solid fa-plus"></i> ${t('common.add')}</button>
            </div>
            ${buildPanelRelationships(meta, {
                settings,
                horaeManager,
                t,
            })}
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