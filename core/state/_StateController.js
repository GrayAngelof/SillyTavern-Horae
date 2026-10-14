/**
 * Контроллер агрегации состояния Horae.
 * Координирует обработку метаданных сообщений через специализированные подсистемы,
 * удаляет исключённых персонажей и назначает отсутствующие идентификаторы.
 */

import { StateItems } from './_StateItems.js';
import { StateNpcs } from './_StateNpcs.js';
import { StateAffection } from './_StateAffection.js';
import { StateMood } from './_StateMood.js';
import { StateScene } from './_StateScene.js';
import { StateCostumes } from './_StateCostumes.js';
import { StateTimestamp } from './_StateTimestamp.js';
import { StateIds } from './_StateIds.js';
import { StateAgenda } from './_StateAgenda.js';
import { StateCharacters } from './_StateCharacters.js';

import {
    COUNTING_CLASSIFIERS,
    findExistingItemByBaseName,
    getItemBaseName,
} from './_itemUtils.js';

export class StateController {
    constructor({
    createEmptyMeta,
    padItemId,
}) {
    this.createEmptyMeta = createEmptyMeta;

    this.npcs = new StateNpcs();
    this.affection = new StateAffection();
    this.mood = new StateMood();
    this.scene = new StateScene();
    this.costumes = new StateCostumes();
    this.timestamp = new StateTimestamp();
    this.agenda = new StateAgenda();
    this.characters = new StateCharacters();

    this.items = new StateItems({
        getItemBaseName,
        findExistingItemByBaseName,
        countingClassifiers: COUNTING_CLASSIFIERS,
    });

    this.ids = new StateIds({
        padItemId,
    });
}

    // Собирает итоговое состояние из метаданных сообщений чата.
    getLatestState(chat, skipLast = 0) {
        const state = this.createEmptyMeta();
        state._previousLocation = '';
        const end = Math.max(0, chat.length - skipLast);
        
        for (let i = 0; i < end; i++) {
            const meta = chat[i].horae_meta;
            if (!meta) continue;
            if (meta._skipHorae) continue;
            
            // Применяем дату и время сюжета из метаданных текущего сообщения.
            this.timestamp.apply(state, meta);
            
            // Применяем изменения сцены из метаданных текущего сообщения.
            this.scene.apply(state, meta);
            
            // Применяем изменения костюмов из метаданных текущего сообщения.
            this.costumes.apply(state, meta);
            
            // Применяем изменения предметов из метаданных текущего сообщения.
            this.items.apply(state, meta);
            
            // Применяем изменения показателей расположения персонажей.
            this.affection.apply(state, meta);
            
            // Применяем изменения НПС из метаданных текущего сообщения.
            this.npcs.apply(state, meta);

            // Применяем изменения настроения персонажей.
            this.mood.apply(state, meta);

            // Применяем изменения списка задач.
            this.agenda.apply(state, meta);
        }

        // Удаляем исключённых персонажей из итогового состояния.
        this.npcs.removeDeleted(state, chat);

        // Назначаем отсутствующие ID после завершения агрегации состояния.
        this.ids.assign(state);

        return state;
    }
}