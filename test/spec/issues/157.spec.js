import Navigo from '../../../src';

describe('Given the getOnlyURL helper', function () {
  describe('when we use a hash based URL', function () {
    it('should successfully extract only the URL', function () {
      const { getOnlyURL } = (new Navigo()).helpers;
      const url = '/employee?spm=abc#/employee/iparents';

      expect(getOnlyURL(url, true, '#')).to.equal('/employee/iparents');
    });
  });
  describe('when we use a non-hash based routing but we have a hash', function () {
    it('should successfully extract only the URL', function () {
      const { getOnlyURL } = (new Navigo()).helpers;
      const url = '/employee?spm=abc#/employee/iparents';

      expect(getOnlyURL(url, false)).to.equal('/employee');
    });
  });
});
