/**
 * Фасад подсистемы состояния Horae.
 * Предоставляет единый интерфейс для получения актуального состояния чата,
 * скрывая внутреннюю реализацию контроллера и специализированных подсистем.
 */

import { StateController } from './state/_StateController.js';

export function createStateService(dependencies) {
    const controller = new StateController(dependencies);

    return {
        getLatestState(chat, skipLast = 0) {
            return controller.getLatestState(chat, skipLast);
        },
    };
}