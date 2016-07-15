# laravel-elixir-scss-lint

[![npm version](https://badge.fury.io/js/laravel-elixir-scss-lint.svg)](https://badge.fury.io/js/laravel-elixir-scss-lint)
[![Build Status](https://travis-ci.org/ponko2/laravel-elixir-scss-lint.svg?branch=master)](https://travis-ci.org/ponko2/laravel-elixir-scss-lint)

## Install

```sh
$ gem install scss-lint
```

```sh
$ npm install laravel-elixir-scss-lint --save-dev
$ touch .scss-lint.yml
```

## Usage

### Example Gulpfile

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-scss-lint');

elixir(function(mix) {
    mix.scssLint();
});
```

### Advanced example

```javascript
mix.scssLint('resources/assets/sass/**/*.scss');
```

If your gem is installed via [bundler](http://bundler.io)

```javascript
mix.scssLint('', {bundleExec: true});
```
