// getElementById wrapper
function $id(id) {
  return document.getElementById(id);
}

// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTML(url, id) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  req.onload = () => {
    $id(id).innerHTML = req.responseText;
  };
}

// use #! to hash
router = new Navigo(null, true, '#!');
router.on({
  // 'view' is the id of the div element inside which we render the HTML
  'firstroute': () => { loadHTML('./templates/first.html', 'view'); },
  'secondroute': () => { loadHTML('./templates/second.html', 'view'); },
  'thirdroute': () => { loadHTML('./templates/third.html', 'view'); }
});

// set the default route
router.on(() => { $id('view').innerHTML = '<h2>Here by default</h2>'; });

// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

router.resolve();
