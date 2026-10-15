// SillyTavern-Horae/core/state/_StateIds.js
/**
 * Подсистема состояния: назначение идентификаторов.
 *
 * Назначает ID предметам и НПС в собранном состоянии.
 * Предметы и НПС используют независимые последовательности ID.
 */

// ===== КЛАСС =====
export class StateIds {
    // ---- ЖИЗНЕННЫЙ ЦИКЛ ----
    /**
     * @param {Object} deps — зависимости
     * @param {Function} deps.padItemId — функция форматирования ID
     */
    constructor({ padItemId }) {
        this.padItemId = padItemId;
    }

    // ---- ПУБЛИЧНОЕ API ----
    /**
     * Назначает ID только записям, у которых он отсутствует.
     *
     * @param {Object} state — собранное состояние
     */
    assign(state) {
        this._assignMissingIds(state.items);
        this._assignMissingIds(state.npcs);
    }

    // ---- ВНУТРЕННИЕ МЕТОДЫ ----
    /**
     * Назначает отсутствующие ID записям одной коллекции.
     *
     * Сначала находит максимальный существующий ID,
     * затем заполняет пропуски начиная со следующего значения.
     *
     * @param {Object} collection — словарь записей {ключ: {_id?, ...}}
     */
    _assignMissingIds(collection) {
        let maxId = this._findMaxId(collection);

        for (const info of Object.values(collection)) {
            if (!info._id) {
                maxId++;
                info._id = this.padItemId(maxId);
            }
        }
    }

    /**
     * Находит максимальный числовой ID в коллекции.
     *
     * @param {Object} collection — словарь записей {ключ: {_id?, ...}}
     * @returns {number} Максимальный ID или 0, если записей с ID нет
     */
    _findMaxId(collection) {
        let maxId = 0;

        for (const info of Object.values(collection)) {
            if (info._id) {
                const num = parseInt(info._id, 10);
                if (num > maxId) maxId = num;
            }
        }

        return maxId;
    }
}