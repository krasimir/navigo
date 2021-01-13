export default function errorOut(context, done) {
  if (!context.resolveOptions || context.resolveOptions.noMatchWarning === false || typeof context.resolveOptions.noMatchWarning === "undefined") console.warn("Navigo: \"" + context.currentLocationPath + "\" didn't match any of the registered routes.");
  done();
}