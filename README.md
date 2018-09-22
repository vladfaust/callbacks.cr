# Callbacks

[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)
[![Build status](https://img.shields.io/travis/vladfaust/callbacks.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/callbacks.cr)
[![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg?style=flat-square)](https://github.vladfaust.com/callbacks.cr)
[![Releases](https://img.shields.io/github/release/vladfaust/callbacks.cr.svg?style=flat-square)](https://github.com/vladfaust/callbacks.cr/releases)
[![Awesome](https://github.com/vladfaust/awesome/blob/badge-flat-alternative/media/badge-flat-alternative.svg)](https://github.com/veelenga/awesome-crystal)
[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)
[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)

An expressive callbacks module for [Crystal](https://crystal-lang.org/).

[![Become a Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  callbacks:
    github: vladfaust/callbacks.cr
    version: ~> 0.1.1
```

This shard follows [Semantic Versioning 2.0.0](https://semver.org/), so see [releases](https://github.com/vladfaust/callbacks.cr/releases) and change the `version` accordingly.

## Usage

```crystal
require "callbacks"

class Foo
  include Callbacks

  def call
    with_callbacks { puts "call" }
  end

  before do
    puts "1"; true # Must return truthy value for the callchain to proceed
  end

  before do
    puts "2"; true
  end

  around do
    puts "3"
    yield
    puts "4"
  end

  after do
    puts "5"
  end

  after do
    puts "6" # Will not be called because previous after callback returned falsey value
  end
end

Foo.new.call
# 1, 2, 3, call, 4, 5
```

Objects including `Callbacks` module can also be inherited preserving all callbacks:

```crystal
class Bar < Foo
  # Childrens before callbacks have higher precedence
  before do
    puts "7"; true
  end

  # Childrens around callbacks are higher in the stack
  around do
    puts "8"
    yield
    puts "9"
  end

  # Childrens after callbacks executed after parents'
  after do
    puts "10" # Will not be called as well because Foo's arounds stop at 5
  end
end

Bar.new.call
# 7, 1, 2, 8, 3, call, 4, 9, 5
```

## Contributing

1. Fork it (<https://github.com/vladfaust/callbacks.cr/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer
