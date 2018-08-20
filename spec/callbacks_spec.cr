require "./spec_helper"

class Parent
  include Callbacks

  @buffer = [] of String
  getter buffer

  before { @buffer.push("parent before #1") }
  before { @buffer.push("parent before #2") }

  around do
    @buffer.push("parent around #1 before")
    yield
    @buffer.push("parent around #1 after")
  end

  around do
    @buffer.push("parent around #2 before")
    yield
    @buffer.push("parent around #2 after")
  end

  after { @buffer.push("parent after #1") }
  after { @buffer.push("parent after #2") }

  def call
    with_callbacks { @buffer.push("call") }
  end
end

class Child < Parent
  before { @buffer.push("child before #1") }
  before { @buffer.push("child before #2") }

  around do
    @buffer.push("child around #1 before")
    yield
    @buffer.push("child around #1 after")
  end

  around do
    @buffer.push("child around #2 before")
    yield
    @buffer.push("child around #2 after")
  end

  after { @buffer.push("child after #1") }
  after { @buffer.push("child after #2") }
end

class SubChild < Child
  before { @buffer.push("subchild before #1") }
  before { @buffer.push("subchild before #2") }

  around do
    @buffer.push("subchild around #1 before")
    yield
    @buffer.push("subchild around #1 after")
  end

  around do
    @buffer.push("subchild around #2 before")
    yield
    @buffer.push("subchild around #2 after")
  end

  after { @buffer.push("subchild after #1"); false }
  after { @buffer.push("subchild after #2") } # Must not be called
end

describe Callbacks do
  it "work with Parent" do
    instance = Parent.new
    instance.call
    instance.buffer.should eq "
      parent before #1
      parent before #2
      parent around #1 before
      parent around #2 before
      call
      parent around #2 after
      parent around #1 after
      parent after #1
      parent after #2
      ".split("\n").map(&.strip).reject(&.empty?)
  end

  it "work with Child" do
    instance = Child.new
    instance.call
    instance.buffer.should eq "
      child before #1
      child before #2
      parent before #1
      parent before #2
      child around #1 before
      child around #2 before
      parent around #1 before
      parent around #2 before
      call
      parent around #2 after
      parent around #1 after
      child around #2 after
      child around #1 after
      parent after #1
      parent after #2
      child after #1
      child after #2
      ".split("\n").map(&.strip).reject(&.empty?)
  end

  it "work with SubChild" do
    instance = SubChild.new
    instance.call
    instance.buffer.should eq "
      subchild before #1
      subchild before #2
      child before #1
      child before #2
      parent before #1
      parent before #2
      subchild around #1 before
      subchild around #2 before
      child around #1 before
      child around #2 before
      parent around #1 before
      parent around #2 before
      call
      parent around #2 after
      parent around #1 after
      child around #2 after
      child around #1 after
      subchild around #2 after
      subchild around #1 after
      parent after #1
      parent after #2
      child after #1
      child after #2
      subchild after #1
    ".split("\n").map(&.strip).reject(&.empty?)
  end
end
