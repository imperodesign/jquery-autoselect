# jquery-autoselect
Turns any select tag into an autocomplete field with weighted options, synonyms and loose matching.

## Prerequisites
- Browserify
- Babelify

## Install
```sh
$ npm install --save jquery-autoselect
```

## Usage
Compile the `JS` file running
```sh
$ browserify demo.js -t babelify --outfile demo.compiled.js
```
then include it in your HTML file.

### JS
```js
'use strict';

import jqueryAutoselect from 'jquery-autoselect';

jqueryAutoselect($);

```

### HTML
```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title>jquery-autoselect</title>
	<script src="/path/to/jquery-1.11.1.min.js"></script>
	<script src="/path/to/jquery-ui.min.js"></script>
	<script src="demo.compiled.js"></script>
	<link rel="stylesheet" href="jquery-ui.css">
	<style>
	  body {
	    font-family: Arial, Verdana, sans-serif;
	    font-size: 13px;
	  }
    .ui-autocomplete {
      padding: 0;
      list-style: none;
      background-color: #fff;
      width: 218px;
      border: 1px solid #B0BECA;
      max-height: 350px;
      overflow-x: hidden;
    }
    .ui-autocomplete .ui-menu-item {
      border-top: 1px solid #B0BECA;
      display: block;
      padding: 4px 6px;
      color: #353D44;
      cursor: pointer;
    }
    .ui-autocomplete .ui-menu-item:first-child {
      border-top: none;
    }
    .ui-autocomplete .ui-menu-item.ui-state-focus {
      background-color: #D5E5F4;
      color: #161A1C;
    }
	</style>
</head>
<body>
  <form>
    <select name="Country" id="country-selector" autofocus="autofocus" autocorrect="off" autocomplete="off">
      <option value="" selected="selected">Select Country</option>
      <option value="Afghanistan" data-alternative-spellings="AF افغانستان">Afghanistan</option>
      <option value="Åland Islands" data-alternative-spellings="AX Aaland Aland" data-relevancy-booster="0.5">Åland Islands</option>
      ...
    </select>

    <input type="submit" value="Submit">
  </form>
</body>
</html>
```
