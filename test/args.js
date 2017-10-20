module.exports = {
  getBrowser: function () {
    if (process.env.TESTING_IN) {
      return process.env.TESTING_IN;
    }
    return 'PhantomJS';
  },
  isWatching: function () {
    return process.argv[3] && process.argv[3] === '--watch=true';
  }
};
