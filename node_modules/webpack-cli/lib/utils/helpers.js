/**
 * Convert camelCase to kebab-case
 * @param {string} str input string in camelCase
 * @returns {string} output string in kebab-case
 */
function toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = { toKebabCase };
