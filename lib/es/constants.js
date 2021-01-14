export var PARAMETER_REGEXP = /([:*])(\w+)/g;
export var REPLACE_VARIABLE_REGEXP = "([^/]+)";
export var WILDCARD_REGEXP = /\*/g;
export var REPLACE_WILDCARD = "?(?:.*)";
export var NOT_SURE_REGEXP = /\/\?/g;
export var REPLACE_NOT_SURE = "/?([^/]+|)";
export var START_BY_SLASH_REGEXP = "(?:/^|^)";
export var MATCH_REGEXP_FLAGS = "";