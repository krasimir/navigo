module.exports = {
  getBrowser: function () {
    if (process.argv[2]) {
      return process.argv[2].replace('--browser=', '');
    }
    return 'PhantomJS';
  },
  isWatching: function () {
    return process.argv[3] && process.argv[3] === '--watch=true';
  }
};
