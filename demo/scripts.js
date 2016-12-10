var router;
var el = function (sel) {
  return document.querySelector(sel);
};
var setContent = function (id, content) {
  el('.js-content').innerHTML = content || el('#content-' + id).innerHTML;
};
var routing = function (mode) {
  router = new Navigo(null, mode === 'hash');
  router.on({
    'usage': function () {
      setContent('usage');
    },
    'download': function () {
      setContent('download');
    },
    'about': function () {
      setContent('about');
    },
    'this/*/:language/:what': function (params) {
      var id = 'parameterized';
      var content = el('#content-' + id).innerHTML;

      Object.keys(params).forEach(function (key) {
        content = content.replace(new RegExp('{{' + key + '}}', 'g'), params[key]);
      });
      setContent(id, content);
    }
  });
  router.on(function () {
    setContent('about');
  });
  router.resolve();
};

var switchModes = function () {
  var trigger = el('.js-mode-trigger');
  var mode = 'history-api';
  var isLocalStorageSupported = !!window.localStorage;
  var rerenderTrigger = function (mode) {
    trigger.querySelector('input').checked = mode === 'hash';
  };

  if (isLocalStorageSupported) {
    mode = localStorage.getItem('navigo') || mode;
  }
  rerenderTrigger(mode);

  trigger.addEventListener('click', function () {
    mode = mode === 'history-api' ? 'hash' : 'history-api';
    isLocalStorageSupported && localStorage.setItem('navigo', mode);
    window.location.href = (router.root || '').replace('#', '');
    setTimeout(function () {
      window.location.reload(true);
    }, 200);
  });

  return mode;
};

var init = function () {
  routing(switchModes());

  document.querySelector('#toDownload').addEventListener('click', function (e) {
    e.preventDefault();
    router.navigate('/download');
  });
};

window.onload = init;
