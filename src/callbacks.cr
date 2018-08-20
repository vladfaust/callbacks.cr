# This module allows to define callbacks.
#
# Example usage:
#
# ```
# require "callbacks"
#
# class MyClass
#   include Callbacks
#
#   def call
#     with_callbacks do
#       puts "call"
#     end
#   end
#
#   before do
#     puts "before"; true # If any of `before` callbacks returns falsey value, the call is aborted
#   end
#
#   before do
#     puts "another before"; true
#   end
#
#   around do
#     puts "begin around"
#     yield
#     puts "end around"
#   end
#
#   around do
#     puts "begin inner around"
#     yield
#     puts "end inner around"
#   end
#
#   # After callbacks are always called despite of `around` return value
#   after do
#     puts "after"
#   end
#
#   after do
#     puts "will not be called" # Because previous after callback returns nil
#   end
# end
#
# MyClass.new.call
#
# # => before
# # => another before
# # => begin around
# # => begin inner around
# # => call
# # => end inner around
# # => end around
# # => after
# ```
#
# Objects including `Callbacks` can be inherited, please refer to each method's description for more information.
module Callbacks
  macro included
    {% unless @type.has_method?(:before) %}
      def before
        true
      end
    {% end %}

    {% unless @type.has_method?(:around) %}
      def around(&block)
        yield
      end
    {% end %}

    {% unless @type.has_method?(:after) %}
      def after
        true
      end
    {% end %}
  end

  # Add before callback.
  #
  # Should return truthy value, otherwise the whole callback chain is aborted.
  #
  # Further before callbacks are called later in the scope of a single object. When defined in children, before callbacks have higher precedence:
  #
  # ```
  # class Foo
  #   include Callbacks
  #
  #   before do
  #     puts "1"; true
  #   end
  #
  #   before do
  #     puts "2" #  Falsey value aborts the callchain
  #   end
  #
  #   before do
  #     puts "3" # Will not be called
  #   end
  # end
  #
  # class Bar < Foo
  #   before do
  #     puts "4"
  #   end
  # end
  #
  # Bar.new.with_callbacks { puts "call" } # "call" will not be put
  # # => 4, 1, 2
  # ```
  macro before(&block)
    def before
      {% if existing = @type.methods.find { |d| d.name == "before" } %}
        {% if @type.superclass && @type.superclass.methods.any? { |d| d.name == "before" } %}
          {% to_insert = "#{yield} && super" %}
          {{existing.body.stringify.gsub(/super/, to_insert).id}}
        {% else %}
          previous_def && {{yield.id}}
        {% end %}
      {% else %}
        {% if @type.superclass && @type.superclass.methods.any? { |d| d.name == "before" } %}
          ({{yield.id}}) && super
        {% else %}
          {{yield.id}}
        {% end %}
      {% end %}
    end
  end

  # Add around callback.
  #
  # Any value can be returned by this callback, this would not affect the callchain.
  #
  # Further around callbacks are deeper in the stack. When inherited, childrens around callbacks will be higher in the stack than the super class'.
  #
  #
  # ```
  # class Foo
  #   include Callbacks
  #
  #   around do
  #     puts "1"
  #     yield
  #     puts "2"
  #   end
  #
  #   around do
  #     puts "3"
  #     yield
  #     puts "4"
  #   end
  # end
  #
  # class Bar < Foo
  #   around do
  #     puts "5"
  #     yield
  #     puts "6"
  #   end
  #
  #   around do
  #     puts "7"
  #     yield
  #     puts "8"
  #   end
  # end
  #
  # Bar.new.with_callbacks { puts "call" }
  # # => 5, 7, 1, 3, call, 4, 2, 6, 8
  # ```
  macro around(&block)
    def around(&block)
      {% if existing = @type.methods.find { |d| d.name == "around" } %}
        {% if @type.superclass && @type.superclass.methods.any? { |d| d.name == "around" } %}
          {% body = "\n" %}
          {% for exp in yield.expressions %}
            {% if "#{exp}".includes?("yield") %}
              {% body = body + "#{exp}".gsub(/yield/, "super{ yield }") + "\n" %}
            {% else %}
              {% body = body + "#{exp}" + "\n" %}
            {% end %}
          {% end %}
          {% body = body + "\n" %}
          {{existing.body.stringify.gsub(/super\(\) do\n  yield\nend/, body).id}}
        {% else %}
          previous_def do
            {{yield.id}}
          end
        {% end %}
      {% else %}
        {% if @type.superclass && @type.superclass.methods.any? { |d| d.name == "around" } %}
          {% for exp in yield.expressions %}
            {% if "#{exp}".includes?("yield") %}
              {{"#{exp}".gsub(/yield/, "super{ yield }").id}}
            {% else %}
              {{exp.id}}
            {% end %}
          {% end %}
        {% else %}
          {{yield.id}}
        {% end %}
      {% end %}
    end
  end

  # Add after callback.
  #
  # Should return truthy value, otherwise further after callbacks are not called.
  #
  # Further after callbacks are called later in the scope of a single object. When defined in children, after callbacks have lower precedence:
  #
  # ```
  # class Foo
  #   include Callbacks
  #
  #   after do
  #     puts "1"; true
  #   end
  #
  #   after do
  #     puts "2"; true
  #   end
  # end
  #
  # class Bar < Foo
  #   after do
  #     puts "3" #  Falsey value aborts the callchain
  #   end
  #
  #   after do
  #     puts "4" # Will not be called
  #   end
  # end
  #
  # Bar.new.with_callbacks { puts "call" }
  # # => call, 1, 2, 3
  # ```
  macro after(&block)
    def after
      {% if @type.methods.find { |d| d.name == "after" } %}
        if previous_def
          {{yield.id}}
        end
      {% elsif @type.superclass && @type.superclass.methods.find { |d| d.name == "after" } %}
        if super
          {{yield.id}}
        end
      {% else %}
        {{yield.id}}
      {% end %}
    end
  end

  def with_callbacks(&block)
    before && around { yield }; after
  end
end
