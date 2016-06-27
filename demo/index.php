<?php

  $path = str_replace('index.php', '' , $_SERVER['SCRIPT_NAME']);
  $root = "http://".$_SERVER['HTTP_HOST'].$path;
  $navigoURL = 'http://krasimir.github.io/navigo/lib/navigo.js';
  // $navigoURL = 'http://home.dev/Krasimir/navigo/lib/navigo.js'; // while developing locally

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Navigo</title>
  <link href='https://fonts.googleapis.com/css?family=Exo+2:400,200italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="<?php echo $root; ?>styles.css" />
  <link rel="stylesheet" type="text/css" href="<?php echo $root; ?>vendor/mocha.css" />

  <script type="text/content" id="content-about">
    <p class="big center u-mb">
      Lightweight JavaScript router<br />
      <small>It does only one thing -<br />it maps a URL to a function.<br />That&#39;s it!</small>
    </p>
    <p>
      <ul>
        <li>Small file size (~3KB minified)</li>
        <li>No dependencies.</li>
        <li>Uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API" target="_blank">History API</a></li>
        <li>Fallbacks to the good old hash based routing if History API is not supported</li>
      </ul></p>
    <p>
    <hr />
    <p>GitHub repository: <a href="https://github.com/krasimir/navigo" target="_blank">https://github.com/krasimir/navigo</a></p>
    <p><iframe src="https://ghbtns.com/github-btn.html?user=krasimir&repo=navigo&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></p>
  </script>

  <script type="text/content" id="content-usage">
    <p class="big">Getting started</p>
    <p>Install the library via npm:</p>
    <pre>npm install navigo</pre>
    <p class="no-margin">
      Or download the browser-ready version from the following links:
    </p>
    <ul>
      <li><a href="https://raw.githubusercontent.com/krasimir/navigo/master/lib/navigo.js" target="_blank">navigo.js</a></li>
      <li><a href="https://raw.githubusercontent.com/krasimir/navigo/master/lib/navigo.min.js" target="_blank">navigo.min.js</a></li>
    </ul>
    <p>Then simply create an instance:</p>
    <pre>var router = new Navigo();</pre>
    <p class="big">Adding a route</p>
    <p>There are several way to register a new route:</p>
    <pre>router.on('/something/here', function () {
  ...
});

router.on(/^app\/(\d)$/, function () {
  ...
});

router.on({
  'something/here': function () {
    ...
  }
})

router.on(function() {
  // ... all the urls end here
});

router.resolve();
</pre>
    <p>As every routing library Navigo supports parameterized URLS:</p>
    <pre>router.on('/user/:id/:action', function (params) {
  // If we have http://site.com/user/42/save as a url then
  // params.id = 42
  // params.action = save
});

router.on(/users\/(\d+)\/(\w+)\/?/, function (id, action) {
  // If we have http://site.com/user/42/save as a url then
  // id = 42
  // action = save
});

router.resolve();</pre>
    <p class="big">Moving to another page</p>
    <pre>router.navigate('some/other/url');</pre>
    <p class="big">Handle/Bind/Attach to page links</p>
    <p>Navigo automatically binds links that contain <b>data-navigo</b> attribute.</p>
    <pre>&lt;a href="about" data-navigo>About&lt;/a></pre>
    <p>The result is a <i>onclick</i> handler that calls <i>router.navigate</i> internaly.</p>
    <p class="big">Documentation</p>
    <p>The full documentation is available on Navigo&#39;s <a href="https://github.com/krasimir/navigo">GitHub page</a>.</p>
  </script>

  <script type="text/content" id="content-download">
    <p class="big">Download</p>
    <pre>npm install navigo</pre>
    <p>or</p>
    <ul>
      <li><a href="https://raw.githubusercontent.com/krasimir/navigo/master/lib/navigo.js" target="_blank">navigo.js</a> (raw source)</li>
      <li><a href="https://raw.githubusercontent.com/krasimir/navigo/master/lib/navigo.min.js" target="_blank">navigo.min.js</a> (minified)</li>
    </ul>
  </script>
  <script type="text/content" id="content-try-it">
    <p class="big">Try it</p>
    <a class="jsbin-embed" href="http://jsbin.com/toqoqe/edit?js,output">JS Bin on jsbin.com</a>
  </script>
  <script type="text/content" id="content-parameterized">
    <small>(The content of this page is based on the URL)</small>
    <p class="big">Navigo is a {{language}} {{what}} !!!</p>
    <pre>Route:
this/*/:language/:what

Matching url:
this/is/{{language}}/{{what}}</pre>
  </script>
  <script type="text/content" id="content-testing">
    <p class="big">Testing</p>
    <hr />
    <div id="mocha"></div>
  </script>

</head>
<body>
  <div class="container">
    <h1>Navigo</h1>
    <nav>
      <a href="about" data-navigo>About</a>
      <a href="usage" data-navigo>Usage</a>
      <a href="download" data-navigo>Download</a>
      <a href="testing" data-navigo>Run tests</a>
      <a href="http://jsbin.com/toqoqe/edit?js,output" target="_blank">Try it</a>
    </nav>
    <div class="js-content content"></div>
    <footer>
      <a href="https://github.com/krasimir/navigo">github.com/krasimir/navigo</a><br /><br />
      <a href="this/is/javascript/router" data-navigo>Navigo is a lightweight JavaScript router</a>
    </footer>
  </div>
  <div class="mode-trigger js-mode-trigger">
    <a href="javascript: void(0);">
      <input type="checkbox" /> hash based routing
    </a>
  </div>

  <a href="https://github.com/krasimir/navigo" target="_blank"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/c6625ac1f3ee0a12250227cf83ce904423abf351/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_gray_6d6d6d.png"></a>

  <script src="<?php echo $navigoURL; ?>"></script>
  <script>var root = '<?php echo $root; ?>';</script>
  <script src="<?php echo $root; ?>scripts.js"></script>
  <script src="<?php echo $root; ?>vendor/chai.js"></script>
  <script src="<?php echo $root; ?>vendor/mocha.js"></script>
  <script>mocha.setup('bdd');</script>
  <script src="<?php echo $root; ?>tests.js"></script>
</body>
</html>
