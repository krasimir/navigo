<?php

  $path = str_replace('index.php', '' , $_SERVER['SCRIPT_NAME']);
  $root = "http://".$_SERVER['HTTP_HOST'].$path;
  $navigoURL = '../../lib/navigo.js';

?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Navigo</title>
  <link href='https://fonts.googleapis.com/css?family=Exo+2:400,200italic' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="<?php echo $root; ?>styles.css" />

  <script type="text/content" id="content-about">
    <p>Navigo at GitHub:
      <a href="https://github.com/krasimir/navigo" target="_blank">
        https://github.com/krasimir/navigo
      </a>
    </p>
  </script>

  <script type="text/content" id="content-usage">
    ... check out <a href="https://github.com/krasimir/navigo">in GitHub</a>
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

</head>
<body>
  <div class="container">
    <h1>Navigo</h1>
    <nav>
      <a href="about" data-navigo>About</a>
      <a href="usage" data-navigo>Usage</a>
      <a href="download" data-navigo>Download</a>
    </nav>
    <div class="js-content content"></div>
    <footer>
      <a href="#" id="toDownload">Get Navigo</a><br />
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
</body>
</html>
