// SillyTavern-Horae/core/summary/_SummaryDomRenderer.js
/**
 * DOM-рендерер панели Summary.
 *
 * Получает готовый HTML и зависимости извне.
 * Создаёт DOM панели, вставляет его в сообщение
 * и обновляет связанные элементы интерфейса.
 */

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Отрисовывает панель Summary в DOM сообщения.
 *
 * Вставляет готовый HTML-панели после блока текста сообщения,
 * применяет настройки отображения (видимость, ширина, отступ, тема)
 * и обновляет связанные элементы интерфейса.
 *
 * @param {Element} messageEl — DOM-элемент сообщения
 * @param {number} messageIndex — индекс сообщения
 * @param {string} panelHtml — готовый HTML панели
 * @param {Object} deps — зависимости
 * @param {Function} deps.getSettings — получение настроек отображения
 * @param {Function} deps.bindPanelEvents — привязка обработчиков к панели
 * @param {Function} deps.isLightMode — проверка текущей темы
 * @param {Function} deps.renderRpgHud — рендер RPG-HUD
 * @param {Function} deps.refreshHoraePorts — обновление портов Horae
 */
export function renderMessagePanel(
    messageEl,
    messageIndex,
    panelHtml,
    {
        getSettings,
        bindPanelEvents,
        isLightMode,
        renderRpgHud,
        refreshHoraePorts,
    },
) {
    try {
        // Не создавать панель повторно
        if (messageEl.querySelector('.horae-message-panel')) return;

        const mesTextEl = messageEl.querySelector('.mes_text');
        if (!mesTextEl) return;

        // Создать DOM панели из готового HTML
        mesTextEl.insertAdjacentHTML('afterend', panelHtml);

        const panelEl = messageEl.querySelector('.horae-message-panel');
        if (!panelEl) return;

        bindPanelEvents(panelEl);

        // Применить настройки отображения
        const settings = getSettings();

        if (!settings.showMessagePanel) {
            panelEl.style.display = 'none';
        }

        const width = Math.max(50, Math.min(100, settings.panelWidth || 100));
        if (width < 100) {
            panelEl.style.maxWidth = `${width}%`;
        }

        const offset = Math.max(0, settings.panelOffset || 0);
        if (offset > 0) {
            panelEl.style.marginLeft = `${offset}px`;
        }

        if (isLightMode()) {
            panelEl.classList.add('horae-light');
        }

        // Обновить связанные элементы интерфейса
        renderRpgHud(messageEl, messageIndex);
        refreshHoraePorts(messageEl);
    } catch (err) {
        console.error(
            `[Horae] renderMessagePanel #${messageIndex} failed:`,
            err,
        );
    }
}