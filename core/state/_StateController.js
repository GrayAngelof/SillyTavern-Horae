// SillyTavern-Horae/core/state/_StateController.js
/**
 * Контроллер агрегации состояния Horae.
 *
 * Координирует обработку метаданных сообщений через специализированные подсистемы,
 * удаляет исключённых персонажей и назначает отсутствующие идентификаторы.
 *
 * Порядок применения подсистем соответствует порядку полей в createEmptyMeta():
 * timestamp → scene → characters_present → costumes → items → events →
 * affection → npcs → agenda → mood → relationships
 */

// ===== ИМПОРТЫ =====
import { StateAffection } from './_StateAffection.js';
import { StateAgenda } from './_StateAgenda.js';
import { StateCharacters } from './_StateCharacters.js';
import { StateCostumes } from './_StateCostumes.js';
import { StateEvents } from './_StateEvents.js';
import { StateIds } from './_StateIds.js';
import { StateItems } from './_StateItems.js';
import { StateMood } from './_StateMood.js';
import { StateNpcs } from './_StateNpcs.js';
import { StateRelationships } from './_StateRelationships.js';
import { StateScene } from './_StateScene.js';
import { StateTimestamp } from './_StateTimestamp.js';

import {
    COUNTING_CLASSIFIERS,
    findExistingItemByBaseName,
    getItemBaseName,
} from './_itemUtils.js';


// ===== КЛАСС =====
export class StateController {
    // ---- ЖИЗНЕННЫЙ ЦИКЛ ----
    constructor({
        createEmptyMeta,
        padItemId,
    }) {
        this.createEmptyMeta = createEmptyMeta;

        // Порядок создания подсистем соответствует порядку полей в createEmptyMeta()
        this.timestamp = new StateTimestamp();
        this.scene = new StateScene();
        this.characters = new StateCharacters();
        this.costumes = new StateCostumes();
        this.items = new StateItems({
            getItemBaseName,
            findExistingItemByBaseName,
            countingClassifiers: COUNTING_CLASSIFIERS,
        });
        this.events = new StateEvents();
        this.affection = new StateAffection();
        this.npcs = new StateNpcs();
        this.agenda = new StateAgenda();
        this.mood = new StateMood();
        this.relationships = new StateRelationships();
        this.ids = new StateIds({
            padItemId,
        });
    }

    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Собирает итоговое состояние из метаданных сообщений чата.
     *
     * @param {Array} chat — массив сообщений чата
     * @param {number} skipLast — количество последних сообщений для пропуска
     * @returns {Object} Итоговое состояние
     */
    getLatestState(chat, skipLast = 0) {
        const state = this.createEmptyMeta();
        state._previousLocation = '';
        const end = Math.max(0, chat.length - skipLast);

        for (let i = 0; i < end; i++) {
            const meta = chat[i].horae_meta;
            if (!meta) continue;
            if (meta._skipHorae) continue;

            // Порядок применения соответствует порядку полей в createEmptyMeta()
            this.timestamp.apply(state, meta);
            this.scene.apply(state, meta);
            this.characters.apply(state, meta);
            this.costumes.apply(state, meta);
            this.items.apply(state, meta);
            this.events.apply(state, meta);
            this.affection.apply(state, meta);
            this.npcs.apply(state, meta);
            this.agenda.apply(state, meta);
            this.mood.apply(state, meta);
            this.relationships.apply(state, meta);
        }

        // Постобработка: удаление исключённых персонажей и назначение ID
        this.npcs.removeDeleted(state, chat);
        this.ids.assign(state);

        return state;
    }
}