"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginTransformReactJsx = _interopRequireDefault(require("@babel/plugin-transform-react-jsx"));

var _pluginTransformReactJsxDevelopment = _interopRequireDefault(require("@babel/plugin-transform-react-jsx-development"));

var _pluginTransformReactDisplayName = _interopRequireDefault(require("@babel/plugin-transform-react-display-name"));

var _pluginTransformReactPureAnnotations = _interopRequireDefault(require("@babel/plugin-transform-react-pure-annotations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  let {
    pragma,
    pragmaFrag
  } = opts;
  const {
    pure,
    throwIfNamespace = true,
    runtime = "classic",
    importSource
  } = opts;

  if (runtime === "classic") {
    pragma = pragma || "React.createElement";
    pragmaFrag = pragmaFrag || "React.Fragment";
  }

  const development = !!opts.development;
  return {
    plugins: [[development ? _pluginTransformReactJsxDevelopment.default : _pluginTransformReactJsx.default, {
      importSource,
      pragma,
      pragmaFrag,
      runtime,
      throwIfNamespace,
      pure,
      useBuiltIns: !!opts.useBuiltIns,
      useSpread: opts.useSpread
    }], _pluginTransformReactDisplayName.default, pure !== false && _pluginTransformReactPureAnnotations.default].filter(Boolean)
  };
});

exports.default = _default;