/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/

"use strict";

/** @typedef {string|(string|ConditionalMapping)[]} DirectMapping */
/** @typedef {{[k: string]: MappingValue}} ConditionalMapping */
/** @typedef {ConditionalMapping|DirectMapping|null} MappingValue */
/** @typedef {Record<string, MappingValue>|ConditionalMapping|DirectMapping} ExportsField */
/** @typedef {Record<string, MappingValue>} ImportsField */

/**
 * @typedef {Object} PathTreeNode
 * @property {Map<string, PathTreeNode>|null} children
 * @property {MappingValue} folder
 * @property {Map<string, MappingValue>} files
 */

/**
 * Processing exports/imports field
 * @callback FieldProcessor
 * @param {string} request request
 * @param {Set<string>} conditionNames condition names
 * @returns {string[]} resolved paths
 */

/*
Example exports field:
{
  ".": "./main.js",
  "./feature": {
    "browser": "./feature-browser.js",
    "default": "./feature.js"
  }
}
Terminology:

Enhanced-resolve name keys ("." and "./feature") as exports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

----------

Example imports field:
{
  "#a": "./main.js",
  "#moment": {
    "browser": "./moment/index.js",
    "default": "moment"
  },
  "#moment/": {
    "browser": "./moment/",
    "default": "moment/"
  }
}
Terminology:

Enhanced-resolve name keys ("#a" and "#moment/", "#moment") as imports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

*/

const slashCode = "/".charCodeAt(0);
const dotCode = ".".charCodeAt(0);
const hashCode = "#".charCodeAt(0);

/**
 * @param {ExportsField} exportsField the exports field
 * @returns {FieldProcessor} process callback
 */
module.exports.processExportsField = function processExportsField(
	exportsField
) {
	return createFieldProcessor(
		buildExportsFieldPathTree(exportsField),
		assertExportsFieldRequest,
		assertExportTarget
	);
};

/**
 * @param {ImportsField} importsField the exports field
 * @returns {FieldProcessor} process callback
 */
module.exports.processImportsField = function processImportsField(
	importsField
) {
	return createFieldProcessor(
		buildImportsFieldPathTree(importsField),
		assertImportsFieldRequest,
		assertImportTarget
	);
};

/**
 * @param {PathTreeNode} treeRoot root
 * @param {(s: string) => void} assertRequest assertRequest
 * @param {(s: string, f: boolean) => void} assertTarget assertTarget
 * @returns {FieldProcessor} field processor
 */
function createFieldProcessor(treeRoot, assertRequest, assertTarget) {
	return function fieldProcessor(request, conditionNames) {
		assertRequest(request);

		const match = findMatch(request, treeRoot);

		if (match === null) return [];

		/** @type {DirectMapping|null} */
		let direct = null;
		const [mapping, remainRequestIndex] = match;

		if (isConditionalMapping(mapping)) {
			direct = conditionalMapping(
				/** @type {ConditionalMapping} */ (mapping),
				conditionNames
			);

			// matching not found
			if (direct === null) return [];
		} else {
			direct = /** @type {DirectMapping} */ (mapping);
		}

		const remainingRequest =
			remainRequestIndex !== request.length
				? request.slice(remainRequestIndex)
				: undefined;

		return directMapping(
			remainingRequest,
			direct,
			conditionNames,
			assertTarget
		);
	};
}

/**
 * @param {string} request request
 */
function assertExportsFieldRequest(request) {
	if (request.charCodeAt(0) !== dotCode) {
		throw new Error('Request should be relative path and start with "."');
	}
	if (request.length === 1) return;
	if (request.charCodeAt(1) !== slashCode) {
		throw new Error('Request should be relative path and start with "./"');
	}
	if (request.charCodeAt(request.length - 1) === slashCode) {
		throw new Error("Only requesting file allowed");
	}
}

/**
 * @param {string} request request
 */
function assertImportsFieldRequest(request) {
	if (request.charCodeAt(0) !== hashCode) {
		throw new Error('Request should start with "#"');
	}
	if (request.length === 1) {
		throw new Error("Request should have at least 2 characters");
	}
	if (request.charCodeAt(1) === slashCode) {
		throw new Error('Request should not start with "#/"');
	}
	if (request.charCodeAt(request.length - 1) === slashCode) {
		throw new Error("Only requesting file allowed");
	}
}

/**
 * @param {string} exp export target
 * @param {boolean} expectFolder is folder expected
 */
function assertExportTarget(exp, expectFolder) {
	if (
		exp.charCodeAt(0) === slashCode ||
		(exp.charCodeAt(0) === dotCode && exp.charCodeAt(1) !== slashCode)
	) {
		throw new Error(
			`Export should be relative path and start with "./", got ${JSON.stringify(
				exp
			)}.`
		);
	}

	const isFolder = exp.charCodeAt(exp.length - 1) === slashCode;

	if (isFolder !== expectFolder) {
		throw new Error(
			expectFolder
				? `Expecting folder to folder mapping. ${JSON.stringify(
						exp
				  )} should end with "/"`
				: `Expecting file to file mapping. ${JSON.stringify(
						exp
				  )} should not end with "/"`
		);
	}
}

/**
 * @param {string} imp import target
 * @param {boolean} expectFolder is folder expected
 */
function assertImportTarget(imp, expectFolder) {
	const isFolder = imp.charCodeAt(imp.length - 1) === slashCode;

	if (isFolder !== expectFolder) {
		throw new Error(
			expectFolder
				? `Expecting folder to folder mapping. ${JSON.stringify(
						imp
				  )} should end with "/"`
				: `Expecting file to file mapping. ${JSON.stringify(
						imp
				  )} should not end with "/"`
		);
	}
}

/**
 * Trying to match request to field
 * @param {string} request request
 * @param {PathTreeNode} treeRoot path tree root
 * @returns {[MappingValue, number]|null} match or null
 */
function findMatch(request, treeRoot) {
	if (request.length === 1) {
		const value = treeRoot.files.get("*root*");

		return value ? [value, 1] : null;
	}

	if (treeRoot.children === null && treeRoot.folder === null) {
		const value = treeRoot.files.get(request);

		return value ? [value, request.length] : null;
	}

	let node = treeRoot;
	let lastNonSlashIndex = 0;
	let slashIndex = request.indexOf("/", 2);

	/** @type {[MappingValue, number]|null} */
	let lastFolderMatch = null;

	while (slashIndex !== -1) {
		const folder = request.slice(lastNonSlashIndex, slashIndex);

		const folderMapping = node.folder;
		if (folderMapping) {
			if (lastFolderMatch) {
				lastFolderMatch[0] = folderMapping;
				lastFolderMatch[1] = lastNonSlashIndex;
			} else {
				lastFolderMatch = [folderMapping, lastNonSlashIndex || 2];
			}
		}

		if (node.children === null) return lastFolderMatch;

		const newNode = node.children.get(folder);

		if (!newNode) {
			const value = node.folder;

			return value ? [value, lastNonSlashIndex] : null;
		}

		node = newNode;
		lastNonSlashIndex = slashIndex + 1;
		slashIndex = request.indexOf("/", lastNonSlashIndex);
	}

	const value = node.files.get(
		lastNonSlashIndex > 0 ? request.slice(lastNonSlashIndex) : request
	);

	if (value) {
		return [value, request.length];
	}

	const folderMapping = node.folder;
	if (folderMapping) {
		return [folderMapping, lastNonSlashIndex || 2];
	}

	return lastFolderMatch;
}

/**
 * @param {ConditionalMapping|DirectMapping|null} mapping mapping
 * @returns {boolean} is conditional mapping
 */
function isConditionalMapping(mapping) {
	return (
		mapping !== null && typeof mapping === "object" && !Array.isArray(mapping)
	);
}

/**
 * @param {string|undefined} remainingRequest remaining request when folder mapping, undefined for file mappings
 * @param {DirectMapping|null} dirrectMapping_ direct export
 * @param {Set<string>} conditionNames condition names
 * @param {(d: string, f: boolean) => void} assert asserting direct value
 * @returns {string[]} mapping result
 */
function directMapping(
	remainingRequest,
	dirrectMapping_,
	conditionNames,
	assert
) {
	if (dirrectMapping_ === null) return [];

	const expectFolder = remainingRequest !== undefined;

	if (typeof dirrectMapping_ === "string") {
		assert(dirrectMapping_, expectFolder);

		return expectFolder
			? [`${dirrectMapping_}${remainingRequest}`]
			: [dirrectMapping_];
	}

	const targets = [];

	for (const exp of dirrectMapping_) {
		if (typeof exp === "string") {
			assert(exp, expectFolder);
			targets.push(expectFolder ? `${exp}${remainingRequest}` : exp);
			continue;
		}

		const mapping = conditionalMapping(exp, conditionNames);
		if (!mapping) continue;
		const innerExports = directMapping(
			remainingRequest,
			mapping,
			conditionNames,
			assert
		);
		for (const innerExport of innerExports) {
			targets.push(innerExport);
		}
	}

	return targets;
}

/**
 * @param {ConditionalMapping} conditionalMapping_ conditional mapping
 * @param {Set<string>} conditionNames condition names
 * @returns {DirectMapping|null} direct mapping if found
 */
function conditionalMapping(conditionalMapping_, conditionNames) {
	/** @type {[ConditionalMapping, string[], number][]} */
	let lookup = [[conditionalMapping_, Object.keys(conditionalMapping_), 0]];

	loop: while (lookup.length > 0) {
		const [mapping, conditions, j] = lookup[lookup.length - 1];
		const last = conditions.length - 1;

		for (let i = j; i < conditions.length; i++) {
			const condition = conditions[i];

			// assert default. Could be last only
			if (i !== last) {
				if (condition === "default") {
					throw new Error("Default condition should be last one");
				}
			} else if (condition === "default") {
				const innerMapping = mapping[condition];
				// is nested
				if (isConditionalMapping(innerMapping)) {
					const conditionalMapping = /** @type {ConditionalMapping} */ (innerMapping);
					lookup[lookup.length - 1][2] = i + 1;
					lookup.push([conditionalMapping, Object.keys(conditionalMapping), 0]);
					continue loop;
				}

				return /** @type {DirectMapping} */ (innerMapping);
			}

			if (conditionNames.has(condition)) {
				const innerMapping = mapping[condition];
				// is nested
				if (isConditionalMapping(innerMapping)) {
					const conditionalMapping = /** @type {ConditionalMapping} */ (innerMapping);
					lookup[lookup.length - 1][2] = i + 1;
					lookup.push([conditionalMapping, Object.keys(conditionalMapping), 0]);
					continue loop;
				}

				return /** @type {DirectMapping} */ (innerMapping);
			}
		}

		lookup.pop();
	}

	return null;
}

/**
 * Internal helper to create path tree node
 * to ensure that each node gets the same hidden class
 * @returns {PathTreeNode} node
 */
function createNode() {
	return {
		children: null,
		folder: null,
		files: new Map()
	};
}

/**
 * Internal helper for building path tree
 * @param {PathTreeNode} root root
 * @param {string} path path
 * @param {MappingValue} target target
 */
function walkPath(root, path, target) {
	if (path.length === 2 && path === "./") {
		root.folder = target;
		return;
	}

	let node = root;
	// It is safe to store # and ./ as a part of file
	// because mapping works like string concatenation
	// so typical path tree can looks like
	// root
	// - files: ["./a.js", "./b.js"]
	// - children:
	//    node1:
	//    - files: ["a.js", "b.js"]
	let lastNonSlashIndex = 0;
	// This is safe for "imports" field
	// since specifiers "#" and "#/" are disallowed and
	// should be asserted before "walking"
	let slashIndex = path.indexOf("/", 2);

	while (slashIndex !== -1) {
		const folder = path.slice(lastNonSlashIndex, slashIndex);
		let newNode;

		if (node.children === null) {
			newNode = createNode();
			node.children = new Map();
			node.children.set(folder, newNode);
		} else {
			newNode = node.children.get(folder);

			if (!newNode) {
				newNode = createNode();
				node.children.set(folder, newNode);
			}
		}

		node = newNode;
		lastNonSlashIndex = slashIndex + 1;
		slashIndex = path.indexOf("/", lastNonSlashIndex);
	}

	if (lastNonSlashIndex < path.length) {
		node.files.set(
			lastNonSlashIndex > 0 ? path.slice(lastNonSlashIndex) : path,
			target
		);
	} else {
		node.folder = target;
	}
}

/**
 * @param {ExportsField} field exports field
 * @returns {PathTreeNode} tree root
 */
function buildExportsFieldPathTree(field) {
	const root = createNode();

	// handle syntax sugar, if exports field is direct mapping for "."
	if (typeof field === "string") {
		root.files.set("*root*", field);

		return root;
	} else if (Array.isArray(field)) {
		root.files.set("*root*", field.slice());

		return root;
	}

	const keys = Object.keys(field);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (key.charCodeAt(0) !== dotCode) {
			// handle syntax sugar, if exports field is conditional mapping for "."
			if (i === 0) {
				while (i < keys.length) {
					const charCode = keys[i].charCodeAt(0);
					if (charCode === dotCode || charCode === slashCode) {
						throw new Error(
							`Exports field key should be relative path and start with "." (key: ${JSON.stringify(
								key
							)})`
						);
					}
					i++;
				}

				root.files.set("*root*", field);
				return root;
			}

			throw new Error(
				`Exports field key should be relative path and start with "." (key: ${JSON.stringify(
					key
				)})`
			);
		}

		if (key.length === 1) {
			root.files.set("*root*", field[key]);
			continue;
		}

		if (key.charCodeAt(1) !== slashCode) {
			throw new Error(
				`Exports field key should be relative path and start with "./" (key: ${JSON.stringify(
					key
				)})`
			);
		}

		walkPath(root, key, field[key]);
	}

	return root;
}

/**
 * @param {ImportsField} field imports field
 * @returns {PathTreeNode} root
 */
function buildImportsFieldPathTree(field) {
	const root = createNode();

	const keys = Object.keys(field);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (key.charCodeAt(0) !== hashCode) {
			throw new Error(
				`Imports field key should start with "#" (key: ${JSON.stringify(key)})`
			);
		}

		if (key.length === 1) {
			throw new Error(
				`Imports field key should have at least 2 characters (key: ${JSON.stringify(
					key
				)})`
			);
		}

		if (key.charCodeAt(1) === slashCode) {
			throw new Error(
				`Imports field key should not start with "#/" (key: ${JSON.stringify(
					key
				)})`
			);
		}

		walkPath(root, key, field[key]);
	}

	return root;
}
