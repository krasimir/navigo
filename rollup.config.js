const babelPlugin = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const path = require('path');

const outputs = [];
const plugins = [
  babelPlugin({
    exclude: 'node_modules/**',
    babelrc: false,
    presets: [['es2015', {modules: false, loose: true}], 'stage-1']
  })
];

if (process.env.BUILD === 'production') {
  outputs.push({
    name: 'Navigo',
    format: 'umd',
    file: path.join(__dirname, 'lib', 'navigo.min.js'),
    sourcemap: true
  });

  plugins.push(
    uglify({
      compress: {
        // compress options
        booleans: true,
        dead_code: true,
        drop_debugger: true,
        unused: true,
        keep_fnames: false,
        keep_infinity: true,
        passes: 3
      },
      ie8: false,
      mangle: {
        toplevel: true
      },
      parse: {
        html5_comments: false,
        shebang: false
      },
      toplevel: false,
      warnings: false
    })
  );
} else {
  outputs.push({
    name: 'Navigo',
    format: 'umd',
    file: path.join(__dirname, 'lib', 'navigo.js'),
    sourcemap: false
  });
  outputs.push({
    name: 'Navigo',
    format: 'cjs',
    file: path.join(__dirname, 'lib', 'navigo.cjs.js'),
    sourcemap: false
  });
  outputs.push({
    name: 'Navigo',
    format: 'es',
    file: path.join(__dirname, 'lib', 'navigo.es.js'),
    sourcemap: false
  });
}

export default {
  input: path.join(__dirname, 'src/index.js'),
  output: outputs,
  plugins: plugins
};
