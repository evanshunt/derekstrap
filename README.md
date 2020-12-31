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

# Development

If making any javascript changes, a `yarn build` needs to be run before commit. To install the included pre-commit hook, run the following from the project root:

```
cp pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
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

Initialization example shown here. See [below](#Details--Examples) for details on specific module use.

```
// This should be the path to your SCSS entry point which pulls in the Derekstrap SCSS.
import breakpointList from '../styles/main.scss';

import { Derekstrap, Breakpoints } from '@evanshunt/derekstrap';

Derekstrap.init();
Breakpoints.init(breakpointList);
```

## Features

SubModules

* [Breakpoints](#breakpoints)
* [debounce.js](#debounce-js)
* [Proportional Box](#proportional-box)
* [Proportional Text](#proportional-text)
* [setUserAgent.js](#setuseragent-js)
* [Spacing](#spacing)
* [Text Sizing](#text-sizing)
* [Card Pattern](#card-pattern)

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

After the breakpoints module is initialized it fires a `breakpointChange` event on the window object whenever the viewport size moves past any one of the breakpoints. The `detail` property of the event contains four values

* `detail.breakpoint`: the largest single breakpoint the current viewport size size has surpassed
* `detail.breakpoints`: an array of breakpoints that the current viewport size has surpassed
* `detail.lastBreakpoint`: the largest single breakpoint the previous viewport size size had surpassed
* `detail.lastBreakpoints`: an array of breakpoints that the previous viewport size had surpassed

This can be used to trigger your own JS code on breakpoint changes. The example below fires whenever the viewport crosses the "desktop" breakpoint, either from smaller than desktop to bigger or visa versa:

```
import { Breakpoints } from '@evanshunt/derekstrap';
Breakpoints.init(breakpointList);

window.addEventListener('breakpointChange', (evt) => {
    if (evt.detail.breakpoints.includes('desktop') !== evt.detail.lastBreakpoints.includes('desktop')) {
        // do something here
    }
});
```

Note that the event emitter is debounced. It will not fire until 50ms have passed since the last resize event.

### debounce.js

Derekstrap includes a `debounce()` helper function, used by the Breakpoints module. The code was borrowed from here: [https://davidwalsh.name/javascript-debounce-function](https://davidwalsh.name/javascript-debounce-function). Debouncing is a handy way to ensure a function that runs on resize, scroll, mouse movement or any other event which might occur many times in a row only runs after the action stops.

#### Example usage

```
import { debounce } from '@evanshunt/derekstrap';

var myResizeFunction = debounce(function() {
	// do something here that you want to happen on 
    // resize, but not so often that it crashes the browser
}, 250);

window.addEventListener('resize', myResizeFunction);
```

See [src/Breakpoints.js](src/Breakpoints.js) for another example.

### Proportional Box

The proportional box module is intended to allow you to define an aspect ratio for an element. Often useful for elements which have a background image. The module consists of 3 mixins, two of which are helper methods for `proportional-box()` which is the one you will most likely use in your project.

The method takes 3 arguments. All arguments except `$aspect-ratio` are optional and will depend on other styles applied to the element in order to function properly. By default the mixin assumes a full-bleed element. The opional arguments are there to configure an element that is not full bleed.

All arguments will accept a single value or a breakpoint map. If passing a breakpoint map to more than one argument ensure all breakpoint maps include the exact same breakpoints.

* `$aspect-ratio`: Width / height, probably best written as an expression which evaluates to a number, e.g. `16 / 9` rather than `1.77777`. (required)
* `$view-width`: Defaults to `100vw`. This argument should be the proportion of the viewport widht the element (or it's parent) takes up, excluding fixed margins. If the element takes up 100% of the viewport except for a 50px margin on each side, the value here should still be `100vw`. Only pass a different value here if the image is not proportional to the entire viewport. If it should be `50vw` wide (excluding fixed margins) then pass `50vw`. (optional)

The following background image properties are added to the element using this mixin:

```
background-size: cover;
background-repeat: no-repeat;
background-position: center;
```

<!-- @TODO: add multi-breakpoint examples -->
#### Example usage

```
@use '~@evanshunt/derekstrap';

// Gives a full bleed widget element a 3/2 aspect ratio
.widget {
    @include derekstrap.proportional-box(3/2);
    margin: 0;
    width: 100vw;
    background-image: url(example.png);
}

// Gives a small widget that fills 50% of the viewport with a 20px margin on either side a 1/1 apsect ratio.
.small-widget {
    @include derekstrap.proportional-box(1/1, 50vw, 20px);
    margin: 0 20px;
    width: calc(50vw - 40px);
    background-image: url(example.png);
}
```

### Proportional Text

This module sets the base sizing of text relative to viewport, with resets at each breakpoint defined and configured with the [Breakpoints](#Breakpoints) module. This allows layouts to behave more consistently with fewer odd issues caused by line wrapping. The breakpoint resets ensure the text does not huge on large screens.

In most cases it will be sufficient to import this module in your stylesheets without any additional configuration. It is included by default if you import Derekstrap but to use this module alone you would do the following:

```
@use '~@evanshunt/derekstrap/proportional-text';
```

### setUserAgent.js

When Derekstrap is imported and initialized it runs [setUserAgent.js](src/setUserAgent.js) which appends the browser user agent string to a `data-user-agent` attribute `html` element.

```
import { Derekstrap} from '@evanshunt/derekstrap';
Derekstrap.init();
```

This will result in markup like the following:

```
<html lang="en" data-useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15">
```

### Spacing

The spacing module is a set of mixins for defining the whitespace around a block. It is intended to allow consistency across blocks, and for flexibility allows use of `padding`, `margin` or `left`/`right`/`top`/`bottom` attributes to create the whitespace. By default the mixins will apply to both top and bottom or both left and right, and will use the `padding` attribute, but this can be configured with optional arguments.

To standardize spacing across blocks it will be useful to define your own variable map of spacing using the same breakpoint names as used with the [Breakpoints](#Breakpoints) module.

#### Basic example usage

```
@use '~@evanshunt/derekstrap';

$regular-margins: (
    'base': 2rem,
    'large-phone': 4rem,
    'desktop': 10vw,
    'desktop-large': 12vw,
    'desktop-extra-large': 16vw
);

$section-spacing: (
    'base': 2rem,
    'desktop': 4rem,
    'desktop-extra-large': 8rem
);

.content-block {
    @include derekstrap.horizontal-spacing($regular-margins);
    @include derekstrap.vertical-spacing($section-spacing);
}
```

#### Applying to only one side

Spacing can be applied to a single side of the element by passing the side as the second argument (left or right, or top or bottom). Note that when the spacing is applied to only one side the element, the opposite side gets set to zero. If you do not wish to zero out the opposite side, append '-only' to the name of the side.

```
.content-block {
    // Applies spacing to the left side and zeros out the spacing on the right
    @include derekstrap.horizontal-spacing($regular-margins, 'left');
    // Applies spacing to the top, but does not set a bottom spacing
    @include derekstrap.vertical-spacing($section-spacing, 'top-only');
}
```

### Card Pattern

The card pattern module includes a mixin to quickly generate a common card layout pattern using flexbox. It sets the size and margins of both parent and child elements and allows passing breakpoint maps for arguments to create a responsive layout. If you pass more than one breakpoint map as an argument, ensure they contain the exact same breakpoints and that all included breakpoints have been configured in the $breakpointList variable.

### Example Usage 

```
@use '~@evanshunt/derekstrap';

// This will create a 4 column layout with a 2rem gutter and 3rem space between rows
.parent-element {
    @include derekstrap.card-pattern('.child-selector', 4, 2rem, 3rem);
}

// This will create a layout with a varying number of columns depending on breakpoint
.parent-element {
    @include derekstrap.card-pattern('.child-selector', (
        'base': 1,
        'tablet': 2,
        'desktop': 3
    ), 2rem, 3rem);
}

// This will create a layout with varying columns and gutter size
.parent-element {
    @include derekstrap.card-pattern(
        '.child-selector',
        (
            'base': 1,
            'tablet': 2,
            'desktop': 3
        ),
        (
            'base': 2rem,
            'tablet': 1rem,
            'desktop': 0.5rem
        ),
        3rem
    );
}