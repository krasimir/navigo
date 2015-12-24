import clean from './clean';

export default function getRoot(url, patterns = []) {
  var match;
  var result = url;
  var matches = patterns
    .map(p => {
      return { 
        regExpResult: url.match(new RegExp(clean(p))),
        vars: [] 
      }
    })
    .filter(m => m.regExpResult !== null);

  if (matches.length === 0) {
    return clean(result);
  } else {
    match = matches.shift();
    return clean(result.substr(0, match.regExpResult.index));
  }
};
