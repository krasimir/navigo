<?php

  $path = str_replace('index.php', '' , $_SERVER['SCRIPT_NAME']);
  $root = "http://".$_SERVER['HTTP_HOST'].$path;

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Navigo</title>
  <link href='https://fonts.googleapis.com/css?family=Exo+2:400,200italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="<?php echo $root; ?>styles.css" />

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
});

router.on(function() {
  // ... all the urls end here
});
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
});</pre>
    <p class="big">Moving to another page</p>
    <pre>router.navigate('some/other/url');</pre>
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
    <a class="jsbin-embed" href="http://jsbin.com/toqoqe/embed?js,output">JS Bin on jsbin.com</a>
  </script>
  <script type="text/content" id="content-parameterized">
    <small>(The content of this page is based on the URL)</small>
    <p class="big">Happy New {{number}} {{what}} !!!</p>
    <pre>Route:
happy/new/:number/:what

Matching url:
happy/new/{{number}}/{{what}}</pre>
  </script>

</head>
<body>
  <div class="container">
    <h1>Navigo</h1>
    <nav>
      <a href="javascript:void(0);" data-switchto="about">About</a>
      <a href="javascript:void(0);" data-switchto="usage">Usage</a>
      <a href="javascript:void(0);" data-switchto="download">Download</a>
      <a href="http://jsbin.com/toqoqe/8/edit?js,output" target="_blank">Try it</a>
    </nav>
    <div class="js-content content"></div>
    <footer>
      <a href="https://github.com/krasimir/navigo">github.com/krasimir/navigo</a><br /><br />
      <a href="javascript:void(0);" id="parameterized">Happy New 2016 Year</a>
    </footer>
  </div>
  <div class="mode-trigger js-mode-trigger">
    <a href="javascript: void(0);">
      <input type="checkbox" /> hash based routing
    </a>
  </div>
  <script src="<?php echo $root; ?>navigo.js"></script>
  <script src="<?php echo $root; ?>scripts.js"></script>
</body>
</html>