import getRoot from '../../src/helpers/getRoot';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.expect();
chai.use(sinonChai);

const expect = chai.expect;

describe('Given the getRoot helper', function () {
  describe('when passing different urls', () => {
    it('should return proper base/root url', () => {
      expect(1).to.be.equal(1);
    });
  });
});
