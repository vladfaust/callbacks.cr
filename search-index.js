crystal_doc_search_index_callback({"repository_name":"callbacks","body":"# Callbacks\n\n[![Built with Crystal](https://img.shields.io/badge/built%20with-crystal-000000.svg?style=flat-square)](https://crystal-lang.org/)\n[![Build status](https://img.shields.io/travis/vladfaust/callbacks.cr/master.svg?style=flat-square)](https://travis-ci.org/vladfaust/callbacks.cr)\n[![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg?style=flat-square)](https://github.vladfaust.com/callbacks.cr)\n[![Releases](https://img.shields.io/github/release/vladfaust/callbacks.cr.svg?style=flat-square)](https://github.com/vladfaust/callbacks.cr/releases)\n[![Awesome](https://awesome.re/badge-flat2.svg)](https://github.com/veelenga/awesome-crystal)\n[![vladfaust.com](https://img.shields.io/badge/style-.com-lightgrey.svg?longCache=true&style=flat-square&label=vladfaust&colorB=0a83d8)](https://vladfaust.com)\n[![Patrons count](https://img.shields.io/badge/dynamic/json.svg?label=patrons&url=https://www.patreon.com/api/user/11296360&query=$.included[0].attributes.patron_count&style=flat-square&colorB=red&maxAge=86400)](https://www.patreon.com/vladfaust)\n[![Gitter chat](https://img.shields.io/badge/chat%20on-gitter-green.svg?colorB=ED1965&logo=gitter&style=flat-square)](https://gitter.im/vladfaust/Lobby)\n\nAn expressive callbacks module for [Crystal](https://crystal-lang.org/).\n\n## Supporters\n\nThanks to all my patrons, I can build and support beautiful Open Source Software! 🙏\n\n[Lauri Jutila](https://github.com/ljuti), [Alexander Maslov](https://seendex.ru), Dainel Vera\n\n*You can become a patron too in exchange of prioritized support and other perks*\n\n[![Become Patron](https://vladfaust.com/img/patreon-small.svg)](https://www.patreon.com/vladfaust)\n\n## About\n\nCallbacks defined with this module are properly inherited and run within a scope of the object itself (i.e. have an access to instance variables etc.).\n\n## Installation\n\nAdd this to your application's `shard.yml`:\n\n```yaml\ndependencies:\n  callbacks:\n    github: vladfaust/callbacks.cr\n    version: ~> 0.2.0\n```\n\nThis shard follows [Semantic Versioning 2.0.0](https://semver.org/), so see [releases](https://github.com/vladfaust/callbacks.cr/releases) and change the `version` accordingly.\n\n## Usage\n\n```crystal\nrequire \"callbacks\"\n\nclass Foo\n  include Callbacks\n\n  def call\n    with_callbacks { puts \"call\" }\n  end\n\n  before do\n    puts \"1\"\n  end\n\n  before do\n    puts \"2\"\n  end\n\n  after do\n    puts \"3\"\n  end\n\n  after do\n    puts \"4\"\n  end\nend\n\nFoo.new.call\n# 1, 2, call, 3, 4\n```\n\nObjects including `Callbacks` module can also be inherited preserving all callbacks:\n\n```crystal\nclass Bar < Foo\n  # Childrens before callbacks have higher precedence\n  before do\n    puts \"5\"\n  end\n\n  # Childrens after callbacks executed after parents'\n  after do\n    puts \"6\"\n  end\nend\n\nBar.new.call\n# 5, 1, 2, call, 3, 4, 6\n```\n\n## Contributing\n\n1. Fork it (<https://github.com/vladfaust/callbacks.cr/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [@vladfaust](https://github.com/vladfaust) Vlad Faust - creator, maintainer\n","program":{"html_id":"callbacks/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"callbacks","program":true,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"callbacks/Callbacks","path":"Callbacks.html","kind":"module","full_name":"Callbacks","name":"Callbacks","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"callbacks","program":false,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"This module allows to define callbacks.\n\nExample usage:\n\n```\nrequire \"callbacks\"\n\nclass MyClass\n  include Callbacks\n\n  def call\n    with_callbacks do\n      puts \"call\"\n    end\n  end\n\n  before do\n    puts \"before\"\n  end\n\n  before do\n    puts \"another before\"\n  end\n\n  after do\n    puts \"after\"\n  end\n\n  after do\n    puts \"another after\"\n  end\nend\n\nMyClass.new.call\n\n# => before\n# => another before\n# => call\n# => after\n# => another after\n```\n\nObjects including `Callbacks` can be inherited, please refer to each method's description for more information.","summary":"<p>This module allows to define callbacks.</p>","class_methods":[],"constructors":[],"instance_methods":[{"id":"with_callbacks(&)-instance-method","html_id":"with_callbacks(&)-instance-method","name":"with_callbacks","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"(&)","args_html":"(&)","location":{"filename":"src/callbacks.cr","line_number":144,"url":null},"def":{"name":"with_callbacks","args":[],"double_splat":null,"splat_index":null,"yields":0,"block_arg":null,"return_type":"","visibility":"Public","body":"before\nresult = yield\nafter\nresult\n"}}],"macros":[{"id":"after(&block)-macro","html_id":"after(&amp;block)-macro","name":"after","doc":"Add after callback.\n\nFurther after callbacks are called later in the scope of a single object. When defined in children, their after callbacks have lower precedence:\n\n```\nclass Foo\n  include Callbacks\n\n  after do\n    puts \"1\"\n  end\n\n  after do\n    puts \"2\"\n  end\nend\n\nclass Bar < Foo\n  after do\n    puts \"3\"\n  end\nend\n\nBar.new.with_callbacks { puts \"call\" }\n# => call, 1, 2, 3\n```","summary":"<p>Add after callback.</p>","abstract":false,"args":[],"args_string":"(&block)","location":{"filename":"src/callbacks.cr","line_number":130,"url":null},"def":{"name":"after","args":[],"double_splat":null,"splat_index":null,"block_arg":{"name":"block","doc":null,"default_value":"","external_name":"block","restriction":""},"visibility":"Public","body":"    def after\n      \n{% if @type.methods.find do |__arg0|\n  __arg0.name == \"after\"\nend %}\n        previous_def\n        {{ (yield).id }}\n      {% else %}{% if @type.superclass && (@type.superclass.has_method?(:after)) %}\n        super\n        {{ (yield).id }}\n      {% else %}\n        {{ (yield).id }}\n      {% end %}{% end %}\n\n    \nend\n  \n"}},{"id":"before(&block)-macro","html_id":"before(&amp;block)-macro","name":"before","doc":"Add before callback.\n\nFurther before callbacks are called later in the scope of a single object. When defined in children, their before callbacks have higher precedence:\n\n```\nclass Foo\n  include Callbacks\n\n  before do\n    puts \"1\"\n  end\n\n  before do\n    puts \"2\"\n  end\nend\n\nclass Bar < Foo\n  before do\n    puts \"3\"\n  end\nend\n\nBar.new.with_callbacks { puts \"call\" }\n# => 3, 1, 2, call\n```","summary":"<p>Add before callback.</p>","abstract":false,"args":[],"args_string":"(&block)","location":{"filename":"src/callbacks.cr","line_number":83,"url":null},"def":{"name":"before","args":[],"double_splat":null,"splat_index":null,"block_arg":{"name":"block","doc":null,"default_value":"","external_name":"block","restriction":""},"visibility":"Public","body":"    def before\n      \n{% if existing = @type.methods.find do |d|\n  d.name == \"before\"\nend %}\n        {% if @type.superclass && (@type.superclass.has_method?(\"before\")) %}\n          {% to_insert = \"#{yield}\\nsuper\" %}\n          {{ (existing.body.stringify.gsub(/super/, to_insert)).id }}\n        {% else %}\n          previous_def\n          {{ (yield).id }}\n        {% end %}\n      {% else %}\n        {% if @type.superclass && (@type.superclass.has_method?(:before)) %}\n          ({{ (yield).id }})\n          super\n        {% else %}\n          {{ (yield).id }}\n        {% end %}\n      {% end %}\n\n    \nend\n  \n"}}],"types":[]}]}})