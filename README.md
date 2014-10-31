# laravel-elixir-scss-lint

## Install

```sh
$ gem install scss-lint
```

```sh
$ npm install laravel-elixir-scss-lint --save-dev
$ touch .scss-lint.yml
```

## Usage

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-scss-lint');

elixir(function(mix) {
    mix.scssLint();
});
```

#### bundleExec

If your gem is installed via [bundler](http://bundler.io)

```javascript
mix.scssLint('', {bundleExec: true});
```
