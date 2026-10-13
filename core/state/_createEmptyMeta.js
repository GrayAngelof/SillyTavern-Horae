/**
 * Создаёт пустой объект метаданных Horae с исходной структурой полей.
 */
export function createEmptyMeta() {
    return {
        timestamp: {
            story_date: '',
            story_time: '',
            absolute: '',
        },
        scene: {
            location: '',
            characters_present: [],
            atmosphere: '',
        },
        costumes: {},
        items: {},
        deletedItems: [],
        deletedAgenda: [],
        events: [],
        affection: {},
        npcs: {},
        agenda: [],
        mood: {},
        relationships: [],
    };
}