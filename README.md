# Derekstrap

An SCSS base layout and styles library by Evans Hunt.

## Requirements

This library uses `@forward` and `@use` keywords only available in [Dart Sass](https://sass-lang.com/dart-sass). It will not compile with Node Sass. [Fibers](https://github.com/laverdet/node-fibers) should be included as well to improve compile speed.

Resources:

* https://css-tricks.com/introducing-sass-modules/
* https://stackoverflow.com/questions/63289593/overriding-a-large-number-of-default-values-with-the-use-rule-in-sass-scss

## Installation

```
yarn add @evanshunt/derekstrap;
```

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

### JavaScript

Initialization example shown here. See [below](#Details/Examples) for details on specific module use.

```
// This should be the path to your SCSS entry point which pulls in the Derekstrap SCSS.
import breakpointList from '../styles/main.scss';

import { Derekstrap, Breakpoints } from '@evanshunt/derekstrap';

Derekstrap.init();
Breakpoints.init(breakpointList);
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

## Details / Examples

### Breakpoints

The breakpoints module consists of both SCSS and JS pieces. The SCSS piece is just a set of variables that doesn't do much on it's own, but it is used by other modules to configure responsive sizing, and by the JS piece to enable JS conditions and triggers tied to the same SCSS breakpoints. The breakpoints module assumes a mobile first design pattern; it is used to generate `min-width` media queries.

You can override and individual breakpoint by configuring the variable for that breakpoint 

```
@use '~@evanshunt/derekstrap' with (
    $tablet: 800px
);
```

Or you can add to the breakpoint list by configuring the map variable which contains all the breakpoints

```
@use '~@evanshunt/derekstrap' with (
    $breakpointList: (
        'large-phone': 414px,
        'tablet': 720px,
        'desktop': 992px,
        'desktop-large': 1440px,
        'desktop-extra-large': 1920px,
        'desktop-gargantuan:': 3840px
    )
);
```

#### CSS Exports

If you take a look at [breakpoints/_variables.scss](breakpoints/_variables.scss), you'll notice that it ends with an `:export` statement. This statement allows us to pass values that can will be parsed by `[css-loader](https://github.com/webpack-contrib/css-loader)` and available within a JavaScript file which imports the SCSS. Documentation can be found [here](https://github.com/css-modules/icss#export).

#### JS usage

The breakpoints module needs to be imported and initialized with a breakpoint list in order to work. Making use of the CSS export mentioned above you can initialize the JS module with the breakpoints found in your SCSS. This should be done in your project code rather than within the module in order for any project overrides to be inherited in the JS.

##### Initilization

```
// This should be the path to your SCSS entry point which pulls in the Derekstrap SCSS.
import breakpointList from '../styles/main.scss';

import { Breakpoints } from '@evanshunt/derekstrap';

Breakpoints.init(breakpointList);
```

##### Methods

After initilization. The following methods can be used.

* `Breakpoints.get()`: returns an array of breakpoints that the current viewport size has surpassed.
* `Breakpoints.getCurrent()`: returns the largest single breakpoint that the current viewport size has surpassed.
* `minWidth($breakpointName)`: when passed a string value corresponding to a breakpoint name returns a boolean indicating whether the current viewport size has surpassed the given breakpoint.

##### Events

## Gotchas

This library is in active development. Pull in a particular commit or tag, or coordinate with Dave if you'd like to use it in your project as it may be subject to change.