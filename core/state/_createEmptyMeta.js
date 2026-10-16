// SillyTavern-Horae/core/state/_createEmptyMeta.js
/**
 * Метаданные Horae — состояние мира на текущий момент.
 *
 * Порядок полей соответствует порядку инициализации.
 * Все поля инициализируются пустыми значениями для предсказуемой структуры.
 */

// ===== ФАБРИКИ =====
/**
 * Создаёт пустой объект метаданных Horae с исходной структурой полей.
 *
 * @returns {Object} Пустой объект метаданных
 */
export function createEmptyMeta() {
    return {
        // Временная метка истории
        timestamp: {
            story_date: '',
            story_time: '',
            absolute: '',
        },
        // Сцена (место и атмосфера)
        scene: {
            location: '',
            atmosphere: '',
        },
        // Персонажи, присутствующие в сцене
        characters_present: [],
        // Костюмы персонажей
        costumes: {},
        // Предметы
        items: {},
        // Удалённые предметы
        deletedItems: [],
        // События
        events: [],
        // Привязанности
        affection: {},
        // NPC
        npcs: {},
        // Повестка (agenda)
        agenda: [],
        // Удалённые записи повестки (для аудита)
        deletedAgenda: [],
        // Настроение
        mood: {},
        // Отношения между персонажами
        relationships: [],
    };
}