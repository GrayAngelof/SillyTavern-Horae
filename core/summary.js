/**
 * Фасад подсистемы Summary.
 *
 * Предоставляет публичный интерфейс для создания и отображения
 * сводной информации о состоянии чата в панелях сообщений.
 *
 * Создание и оформление панели делегируются SummaryPanelRenderer.
 * Подготовка данных делегируется SummaryController.
 * Формирование HTML делегируется SummaryView.
 *
 * Summary использует State как единственный источник истины
 * о состоянии чата и не реконструирует состояние самостоятельно.
 */

export { createMessagePanelRenderer } from './summary/_SummaryPanelRenderer.js';

export {
    buildPanelContent,
    buildDeletedItemsDisplay,
    buildAgendaEditorRows,
    buildPanelMoodEditable,
    buildPanelRelationships,
} from './summary/_SummaryView.js';


// TODO!!! НЕ ПОТЕРЯТЬ ФУНКЦИОНАЛ ПРИ ПЕРЕРАБОТКЕ ОТОБРАЖЕНИЯ SUMMARY!!!
//
// После завершения переработки отображения Summary обязательно
// восстановить и перенести функциональность:
// - CSS-классы панели и уровень события;
// - сводку событий и счётчик персонажей;
// - режим sideplay, включая состояние пропуска сообщения.
//
// До реализации не удалять этот блок и не считать перенос завершённым.

/*
// Подготавливает CSS-классы панели на основе настроек и уровня события.
export function preparePanelStyleData(meta, settings) {
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);
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

    return { layoutClass, dataLevel };
}

// Подготавливает данные сводки события для заголовка панели.
export function preparePanelSummaryData(meta, t) {
    const eventsArr = meta.events || (meta.event ? [meta.event] : []);

    const eventSummary = eventsArr.length > 0
        ? eventsArr.map(e => e.summary).join(' | ')
        : t('ui.noSpecialEvents');

    const charCount = meta.characters_present?.length || 0;

    return { eventSummary, charCount };
}

// Подготавливает данные режима sideplay для панели сообщения.
export function preparePanelSideplayData(meta, settings) {
    const isSkipped = !!meta._skipHorae;
    const sideplayBtnStyle = settings.sideplayMode ? '' : 'display:none;';

    return { isSkipped, sideplayBtnStyle };
}
*/