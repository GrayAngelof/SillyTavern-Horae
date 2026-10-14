/**
 * Представление подсистемы Summary.
 *
 * Отвечает за преобразование подготовленных данных в HTML-разметку
 * элементов интерфейса и редакторов панели сообщений.
 *
 * Не управляет состоянием приложения, не обращается к horaeManager,
 * не анализирует историю сообщений и не выполняет бизнес-логику.
 * Получает готовые данные и параметры отображения через аргументы.
 *
 * Внутренний модуль. Внешний код должен обращаться к представлению
 * через публичный фасад core/summary.js.
 */

// Формирует HTML-строки редактора повестки.
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

// Формирует HTML-строки редактора настроения персонажей.
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

// Формирует HTML-строки редактора социальных отношений персонажей.
export function buildPanelRelationships(rels, { t }) {
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

// Формирует HTML-строки редактора костюмов.
function buildPanelCostumeRows(costumeEntries, { escapeHtml, t }) {
    return costumeEntries.map(([char, costume]) => `
        <div class="horae-editor-row">
            <input type="text" class="char-input" value="${escapeHtml(char)}" placeholder="${t('placeholder.holderName')}">
            <input type="text" value="${escapeHtml(costume)}" placeholder="${t('placeholder.costumeDesc')}">
            <button class="horae-delete-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `).join('');
}

// Формирует HTML-строки редактора предметов.
function buildPanelItemRows(itemsAtMessage, { escapeHtml, t }) {
    return Object.entries(itemsAtMessage).map(([name, info]) => {
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
}

// Формирует HTML-строки редактора удалённых предметов.
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

// Формирует HTML-строки редактора симпатии персонажей.
function buildPanelAffectionRows(affectionEntries, { escapeHtml, t }) {
    return affectionEntries.map(({ char, prevVal, deltaStr, totalStr }) => `
        <div class="horae-editor-row horae-affection-row"
            data-char="${escapeHtml(char)}"
            data-prev="${prevVal}">
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
    `).join('');
}

// Формирует HTML содержимого панели Summary.
export function buildPanelContent(meta, data, {
    settings,
    escapeHtml,
    t,
}) {
    // Получаем подготовленные данные для отображения панели.
    const {
        costumeEntries,
        itemsAtMessage,
        affectionEntries,
        relationships,
        agendaEntries,
    } = data;

    // Получаем подготовленную повестку.
    const agendaForPanel = agendaEntries;

    // Формируем HTML редактора костюмов.
    const costumeRows = buildPanelCostumeRows(costumeEntries, {
        escapeHtml,
        t,
    });
    
    // Формируем HTML социального взаимодействия персонажей.
    const relationshipsHtml = buildPanelRelationships(relationships, { t });

    // Формируем HTML редактора предметов.
    const itemRows = buildPanelItemRows(itemsAtMessage, {
        escapeHtml,
        t,
    });

    // Формируем HTML редактора симпатии персонажей.
    const affectionRows = buildPanelAffectionRows(affectionEntries, {
        escapeHtml,
        t,
    });

    // Обеспечиваем совместимость с новым и старым форматами событий.
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);
    const firstEvent = eventsArr[0] || {};
    const eventLevel = firstEvent.level || '';
    const eventSummary = firstEvent.summary || '';
    const multipleEventsNote = eventsArr.length > 1 ? `<span class="horae-note">${t('ui.multipleEventsNote', { n: eventsArr.length })}</span>` : '';

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
                    <input type="text" class="horae-input-characters" value="${escapeHtml((meta.characters_present || []).join(', '))}" placeholder="${t('placeholder.charactersSeparated')}">
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

// Формирует HTML оболочки панели Summary для сообщения чата.
export function buildMessagePanelHtml({
    messageIndex,
    isSkipped,
    layoutClass,
    dataLevel,
    time,
    eventSummary,
    charCount,
    sideplayBtnStyle,
    settings,
    contentHtml,
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