/**
 * Назначает идентификаторы предметам и НПС в собранном состоянии.
 */
export class StateIds {
    constructor({ padItemId }) {
        this.padItemId = padItemId;
    }

    /**
     * Назначает ID только записям, у которых он отсутствует.
     * Предметы и НПС используют независимые последовательности ID.
     */
    assign(state) {
        // Находим максимальный существующий ID предмета.
        let maxItemId = 0;

        for (const info of Object.values(state.items)) {
            if (info._id) {
                const num = parseInt(info._id, 10);
                if (num > maxItemId) maxItemId = num;
            }
        }

        // Заполняем отсутствующие ID предметов.
        for (const info of Object.values(state.items)) {
            if (!info._id) {
                maxItemId++;
                info._id = this.padItemId(maxItemId);
            }
        }

        // Находим максимальный существующий ID НПС.
        let maxNpcId = 0;

        for (const info of Object.values(state.npcs)) {
            if (info._id) {
                const num = parseInt(info._id, 10);
                if (num > maxNpcId) maxNpcId = num;
            }
        }

        // Заполняем отсутствующие ID НПС.
        for (const info of Object.values(state.npcs)) {
            if (!info._id) {
                maxNpcId++;
                info._id = this.padItemId(maxNpcId);
            }
        }
    }
}