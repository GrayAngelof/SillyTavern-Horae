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
