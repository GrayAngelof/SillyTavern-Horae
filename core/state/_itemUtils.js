// SillyTavern-Horae/core/state/_itemUtils.js
/**
 * Утилиты для работы с предметами.
 *
 * Предоставляет функции для нормализации названий предметов
 * и поиска существующих предметов по базовому названию.
 */

// ===== КОНСТАНТЫ =====
/**
 * Индивидуальные счётные классификаторы, которые не меняют базовое название предмета.
 */
export const COUNTING_CLASSIFIERS = '个把条块张根口份枚只颗支件套双对碗杯盘盆串束扎';


// ===== ПУБЛИЧНЫЕ ФУНКЦИИ =====
/**
 * Извлекает базовое название предмета.
 *
 * Удаляет конечное количество с единицей измерения
 * или лишний индивидуальный классификатор.
 *
 * @param {string} name — исходное название предмета
 * @returns {string} Базовое название без количества и классификатора
 */
export function getItemBaseName(name) {
    return name
        .replace(/[\(（][\d][\d\.\/]*[a-zA-Z\u4e00-\u9fff]*[\)）]$/, '')
        .replace(new RegExp(`[\\(（][${COUNTING_CLASSIFIERS}][\\)）]$`), '')
        .trim();
}

/**
 * Находит существующий предмет по базовому названию.
 *
 * При точном совпадении возвращает ключ без дополнительного поиска.
 *
 * @param {Object} stateItems — словарь предметов {имя: данные}
 * @param {string} newName — новое имя предмета для поиска
 * @returns {string|null} Ключ существующего предмета или null
 */
export function findExistingItemByBaseName(stateItems, newName) {
    const newBase = getItemBaseName(newName);

    if (stateItems[newName]) return newName;

    for (const existingName of Object.keys(stateItems)) {
        if (getItemBaseName(existingName) === newBase) {
            return existingName;
        }
    }

    return null;
}