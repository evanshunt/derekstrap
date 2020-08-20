# Derekstrap

An SCSS base layout and styles library by Evans Hunt.

## Requirements

This library uses `@forward` and `@use` keywords only available in [Dart Sass](https://sass-lang.com/dart-sass). It will not compile with Node Sass. [Fibers](https://github.com/laverdet/node-fibers) should be included as well to improve compile speed.

Resources:

* https://css-tricks.com/introducing-sass-modules/
* https://stackoverflow.com/questions/63289593/overriding-a-large-number-of-default-values-with-the-use-rule-in-sass-scss

## Usage

### With @import

`@import` '~@evanshunt/derekstrap/index' to make use of the entire library or pull in individual files to pick and choose the pieces you want.

To override any variables defined in the library simply `@import` your own variables with the same name prior to importing the library.

### With @use

You can configure a module exactly once. Before using other styles add something like the following in a `_config.scss` file to override variables

```
@use '~@evanshunt/derekstrap' with (
    $base-font-family: ('Raleway', Tacoma, sans-serif),
    $base-line-height: 1.8,
    $heading-margin-top: 0
);
```

## Features

SubModules

* Breakpoints
* Proportional Box
* Proportional Text
* Spacing
* Text Sizing

JS features

* adds a data-attribute to the dom body with the browser user agent
* includes a handy `debounce()` function
* breakpoint object that you can pass an array of breakpoints to, and you can then check the object to determine your current breakpoint, or listen for a breakpoint change event. You can actually pull in the Derekstrap Sass breakpoints into the JS via a sass :export block. It'll work even if you update/override the Derekstrap `$breakpointList` var

## Examples

Big ol' @TODO here....

The breakpoint stuff is probably the hardest to grok without docs, so chat with @davejtoews if you need a primer.

## Gotchas

This library is in active development. Pull in a particular commit or tag, or coordinate with Dave if you'd like to use it in your project as it may be subject to change.