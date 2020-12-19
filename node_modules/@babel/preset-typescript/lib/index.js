"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginTransformTypescript = _interopRequireDefault(require("@babel/plugin-transform-typescript"));

var _helperValidatorOption = require("@babel/helper-validator-option");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v = new _helperValidatorOption.OptionValidator("@babel/preset-typescript");

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  const {
    allowDeclareFields,
    allowNamespaces,
    jsxPragma,
    onlyRemoveTypeImports
  } = opts;
  const jsxPragmaFrag = v.validateStringOption("jsxPragmaFrag", opts.jsxPragmaFrag, "React.Fragment");
  const allExtensions = v.validateBooleanOption("allExtensions", opts.allExtensions, false);
  const isTSX = v.validateBooleanOption("isTSX", opts.isTSX, false);

  if (isTSX) {
    v.invariant(allExtensions, "isTSX:true requires allExtensions:true");
  }

  const pluginOptions = isTSX => ({
    allowDeclareFields,
    allowNamespaces,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports
  });

  return {
    overrides: allExtensions ? [{
      plugins: [[_pluginTransformTypescript.default, pluginOptions(isTSX)]]
    }] : [{
      test: /\.ts$/,
      plugins: [[_pluginTransformTypescript.default, pluginOptions(false)]]
    }, {
      test: /\.tsx$/,
      plugins: [[_pluginTransformTypescript.default, pluginOptions(true)]]
    }]
  };
});

exports.default = _default;