var router;

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
    'happy/new/:number/:what': function (params) {
      var id = 'parameterized';
      var content = el('#content-' + id).innerHTML;
      Object.keys(params).forEach(function (key) {
        content = content.replace(new RegExp('{{' + key + '}}', 'g'), params[key]);
      });
      setContent(id, content);
    },
    'testing': function () {
      
    }
  });
  router.on(function() {
    setContent('about');
  });
};

var el = function(sel) {
  return document.querySelector(sel);
}

var setContent = function(id, content) {
  el('.js-content').innerHTML = content || el('#content-' + id).innerHTML;
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
    window.location.href = router.root.replace('#', '');
    setTimeout(function () {
      window.location.reload(true);
    }, 200);
  });

  return mode;
};

var mainNavigation = function () {
  []
  .slice
  .call(document.querySelectorAll('nav a'))
  .forEach(function (link) {
    if (link.getAttribute('href').indexOf('http') >= 0) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      router.navigate(link.getAttribute('data-switchto'));
    });
  });
};

var footer = function () {
  el('#parameterized').addEventListener('click', function () {
    router.navigate('happy/new/2016/year/folks');
  });
};

var init = function () {
  routing(switchModes());
  mainNavigation();
  footer();
};

window.onload = init;