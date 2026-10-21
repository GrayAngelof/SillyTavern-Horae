// SillyTavern-Horae/core/summary.js
/**
 * Фасад подсистемы Summary.
 *
 * Предоставляет публичный интерфейс построения панели Summary.
 * Внутренняя подготовка данных, построение HTML и работа с DOM
 * делегируются соответствующим модулям подсистемы.
 *
 * TECHNICAL DEBT:
 *     - Восстановить перенос функциональности CSS-классов, сводки событий
 *       и режима sideplay после переработки отображения Summary
 *       (см. закомментированный блок ниже)
 */

// ===== ИМПОРТЫ =====
import { renderSummary } from './summary/_SummaryController.js';


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Строит и отображает Summary для сообщения.
 *
 * @param {Object} stateAtMessage — состояние текущего сообщения
 * @param {Object} previousState — предыдущее состояние
 * @param {Object} options — параметры построения Summary
 * @returns {*} Результат DOM-рендеринга
 */
export function buildSummary(stateAtMessage, previousState, options) {
    return renderSummary(stateAtMessage, previousState, options);
}


// ===== ЗАРЕЗЕРВИРОВАННЫЙ КОД (технический долг) =====
// TODO: НЕ ПОТЕРЯТЬ ФУНКЦИОНАЛ ПРИ ПЕРЕРАБОТКЕ ОТОБРАЖЕНИЯ SUMMARY!
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