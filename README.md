# laravel-elixir-scss-lint

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
