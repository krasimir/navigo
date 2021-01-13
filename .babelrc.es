{
  "ignore": ["node_modules/**/*"],
  "presets": [
    ["@babel/preset-typescript"],
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "babel-plugin-add-module-exports",
    "@babel/plugin-transform-classes"
  ]
}
