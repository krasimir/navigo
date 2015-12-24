import chai from 'chai';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';
import getRoot from '../../src/helpers/getRoot';

chai.expect();
// chai.use(sinonChai);

const expect = chai.expect;
const cases = [
  { 
    source: 'http://site.com/',
    expected: 'http://site.com',
    patterns: []
  },
  { 
    source: 'http://site.com',
    expected: 'http://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/',
    expected: 'https://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/',
    expected: 'https://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/deep/path',
    expected: 'https://site.com/deep/path',
    patterns: []
  },
  { 
    source: 'http://site.com/deep',
    expected: 'http://site.com',
    patterns: ['deep']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['deep', 'deep/nested']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['deep/nested', 'deep']
  },
  { 
    source: 'http://site.com/deep/nested/?test=10#blahblah',
    expected: 'http://site.com',
    patterns: ['deep/nested', 'deep']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['something/else', '/deep/nested/']
  }
];

describe('Given the getRoot helper', function () {
  cases
    .reduce((state, current) => {
      if (!state.onlyOne) {
        state.all.push(current);
        if (current.only === true) {
          state.onlyOne = true;
          state.all = [ current ];
        }
      }
      return state;
    }, { all: [], onlyOne: false })
    .all
    .forEach(testCase => {
      describe(`when passing ${testCase.source} with patterns ${testCase.patterns.join(', ')}`, () => {
        it(`should return ${testCase.expected}`, () => {
          expect(getRoot(testCase.source, testCase.patterns)).to.be.equal(testCase.expected);
        });
      });
    });
});
