# Derekstrap

A base styles and scss utility library by Evans Hunt.

## Requirements

This library uses `@forward` and `@use` keywords only available in [Dart Sass](https://sass-lang.com/dart-sass). It will not compile with Node Sass.

Resources:

* https://css-tricks.com/introducing-sass-modules/
* https://stackoverflow.com/questions/63289593/overriding-a-large-number-of-default-values-with-the-use-rule-in-sass-scss

## Installation

```bash
yarn add @evanshunt/derekstrap
```

## Development

If making any javascript changes, a `yarn build` needs to be run before commit. To install the included pre-commit hook, run the following from the project root:

```bash
cp pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Demo

The demo page is a self contained static site. It is bundled using the same `yarn build` command. It can be previewed locally by running `docker-compose up` from within the `/docs` directory.

The [live version of the demo site](https://evanshunt.github.io/derekstrap/) is generated by GitHub Pages.

## Usage

### With @import

`@import` '~@evanshunt/derekstrap/index' to make use of the entire library or pull in individual files to pick and choose the pieces you want.

To override any variables defined in the library simply `@import` your own variables with the same name prior to importing the library.

### With @use

You can configure a module exactly once. Before using other styles add something like the following in a `_config.scss` file to override variables

```scss
@use '~@evanshunt/derekstrap' with (
    $base-font-family: ('Raleway', Tacoma, sans-serif),
    $base-line-height: 1.8,
    $heading-margin-top: 0
);
```

### JavaScript

Initialization example shown here. See [below](#Details--Examples) for details on specific module use.

```js
// This should be the path to your SCSS entry point which pulls in the Derekstrap SCSS.
import breakpointList from '../styles/main.scss';

import { Derekstrap, Breakpoints } from '@evanshunt/derekstrap';

Derekstrap.init();
Breakpoints.init(breakpointList);
```

## Features

SubModules

* [Breakpoints](#breakpoints)
* [Card Pattern](#card-pattern)
* [debounce.js](#debounce-js)
* [Map Math](#map-math)
* [Map Slice](#map-slice)
* [Proportional Box](#proportional-box)
* [Proportional Text](#proportional-text)
* [Responsive Properties](#responsive-properties)
* [setUserAgent.js](#setuseragentjs)
* [Spacing](#spacing)
* [Text Sizing](#text-sizing)

JS features

* adds a data-attribute to the dom body with the browser user agent
* includes a handy `debounce()` function
* breakpoint object that you can pass an array of breakpoints to, and you can then check the object to determine your current breakpoint, or listen for a breakpoint change event. You can actually pull in the Derekstrap Sass breakpoints into the JS via a sass :export block. It'll work even if you update/override the Derekstrap `$breakpointList` var

## Details / Examples

The best reference for these modules is likely to read the source code directly. The examples below are not exhaustive; there may be advanced possibilities outside of what is shown here.

### Breakpoints

[See the Demo](https://evanshunt.github.io/derekstrap/#breakpoints).

The breakpoints module consists of both SCSS and JS pieces. The SCSS piece consistes of two parts. The first is a set of variables that doesn't do much on it's own, but it is used by other modules to configure responsive sizing, and by the JS piece to enable JS conditions and triggers tied to the same SCSS breakpoints. The breakpoints module assumes a mobile first design pattern; it is used to generate `min-width` media queries.

You can override and individual breakpoint by configuring the variable for that breakpoint

```scss
@use '~@evanshunt/derekstrap' with (
    $tablet: 800px
);
```

Or you can add to the breakpoint list by configuring the map variable which contains all the breakpoints

```scss
@use '~@evanshunt/derekstrap' with (
    $breakpointList: (
        'phone-large': 414px,
        'tablet': 720px,
        'desktop': 992px,
        'desktop-large': 1440px,
        'desktop-extra-large': 1920px,
        'desktop-gargantuan': 3840px
    )
);
```

The second piece of breakpoints SCSS is a mixin that functions as a wrapper around the [Breakpoint Sass library](http://breakpoint-sass.com). Calling the Derekstrap mixin operates exactly like calling the breakpoint-sass mixin, except it allows you to pass the name of a breakpoint in your $breakpointList as an argument to generate a min-width query.

```scss
@use '~@evanshunt/derekstrap';

h4 {
    @include derekstrap.breakpoint('desktop') {
        font-size: 2em;
    }
}
```

#### CSS Exports

If you take a look at [breakpoints/_variables.scss](breakpoints/_variables.scss), you'll notice that it ends with an `:export` statement. This statement allows us to pass values that can will be parsed by [css-loader](https://github.com/webpack-contrib/css-loader) and available within a JavaScript file which imports the SCSS. Documentation can be found [here](https://github.com/css-modules/icss#export).

#### JS usage

The breakpoints module needs to be imported and initialized with a breakpoint list in order to work. Making use of the CSS export mentioned above you can initialize the JS module with the breakpoints found in your SCSS. This needs to be done in your project code rather than within the module in order for any project overrides to be inherited in the JS.

##### Initilization

```js
// This should be the path to your SCSS entry point which pulls in the Derekstrap SCSS.
import breakpointList from '../styles/main.scss';

import { Breakpoints } from '@evanshunt/derekstrap';

Breakpoints.init(breakpointList);
```

###### NB: Is your breakpointList empty?

Newer versions of css-loader (5+) may need extra configuration in order to handle ```:export```. Below is an example snippet which should fix the issue:

```js
test: /\.s?css$/i,
	use: [
    'style-loader',
    {
        loader: 'css-loader?sourceMap=true',
        /// Important bits below
        options: {
            modules: {
                mode: 'icss' // css-loader 5.x used "compileType, 6.x uses "mode"
            }
        }
    },
    /// Important bits above
    'postcss-loader',
    'sass-loader'
  ]
```

##### Methods

After initilization. The following methods can be used.

* `Breakpoints.get()`: returns an array of breakpoints that the current viewport size has surpassed.
* `Breakpoints.getCurrent()`: returns the largest single breakpoint that the current viewport size has surpassed.
* `Breakpoints.minWidth(breakpointName)`: when passed a string value corresponding to a breakpoint name returns a boolean indicating whether the current viewport size has surpassed the given breakpoint.
* `Breakpoints.onBreakpointCross(breakpointName, callback)`: On crossing the breakpoint corresponding to `breakpointName`, either growing beyond it, or shrinking below it a function passed as a callback is called.
* `Breakpoints.onBreakpointUp(breakpointName, callback)`: Similar to `onBreakpointCross()` but only fires the callback when viewport has grown from below breakpoint to above it
* `Breakpoints.onBreakpointDown(breakpointName, callback)`: Similar to `onBreakpointCross()` but only fires the callback when viewport has shrunk from above breakpoint to below it

##### Events

After the breakpoints module is initialized it fires a `breakpointChange` event on the window object whenever the viewport size moves past any one of the breakpoints. The `detail` property of the event contains four values

* `detail.breakpoint`: the largest single breakpoint the current viewport size size has surpassed
* `detail.breakpoints`: an array of breakpoints that the current viewport size has surpassed
* `detail.lastBreakpoint`: the largest single breakpoint the previous viewport size size had surpassed
* `detail.lastBreakpoints`: an array of breakpoints that the previous viewport size had surpassed

This can be used to trigger your own JS code on breakpoint changes. The example below fires whenever the viewport crosses the "desktop" breakpoint, either from smaller than desktop to bigger or visa versa:

```js
import { Breakpoints } from '@evanshunt/derekstrap';
Breakpoints.init(breakpointList);

window.addEventListener('breakpointChange', (evt) => {
    if (evt.detail.breakpoints.includes('desktop') !== evt.detail.lastBreakpoints.includes('desktop')) {
        // do something here
    }
});
```

Note that the event emitter is debounced. It will not fire until 50ms have passed since the last resize event.

### Card Pattern

[See the Demo](https://evanshunt.github.io/derekstrap/#cards).

The card pattern module includes a mixin to quickly generate a common card layout pattern using flexbox. It sets the size and margins of both parent and child elements and allows passing breakpoint maps for arguments to create a responsive layout. If you pass more than one breakpoint map as an argument, ensure they contain the exact same breakpoints and that all included breakpoints have been configured in the $breakpointList variable.

### Example Usage

```scss
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
```
### debounce.js

Derekstrap includes a `debounce()` helper function, used by the Breakpoints module. The code was borrowed from here: [https://davidwalsh.name/javascript-debounce-function](https://davidwalsh.name/javascript-debounce-function). Debouncing is a handy way to ensure a function that runs on resize, scroll, mouse movement or any other event which might occur many times in a row only runs after the action stops.

#### Example usage

```js
import { debounce } from '@evanshunt/derekstrap';

const myResizeFunction = debounce(function() {
	// do something here that you want to happen on 
    // resize, but not so often that it crashes the browser
}, 250);

window.addEventListener('resize', myResizeFunction);
```

See [src/Breakpoints.js](src/Breakpoints.js) for another example.

### Map Math / Slice

Because so much of Derekstrap's functionality depends on breakpoint map variables, we've included some tools to generate new maps from existing ones. The first set of tools allows basic mathematical operations to be run against every value in a map set.

See the [Sass Map Magic](https://github.com/davejtoews/sass-map-magic) docs for details.

These functions are included in Derekstrap as aliases, but they can also be used directly from the source library.
### Proportional Box

_This module may now be obsolete as [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) now has pretty good [browser support](https://caniuse.com/mdn-css_properties_aspect-ratio)._

The proportional box module is intended to allow you to define an aspect ratio for an element. Often useful for elements which have a background image. The module consists of 3 mixins, two of which are helper methods for `proportional-box()` which is the one you will most likely use in your project.

The method takes 3 arguments. All arguments except `$aspect-ratio` are optional and will depend on other styles applied to the element in order to function properly. By default the mixin assumes a full-bleed element. The opional arguments are there to configure an element that is not full bleed.

All arguments will accept a single value or a breakpoint map. If passing a breakpoint map to more than one argument ensure all breakpoint maps include the exact same breakpoints.

* `$aspect-ratio`: Width / height, probably best written as an expression which evaluates to a number, e.g. `16 / 9` rather than `1.77777`. (required)
* `$view-width`: Defaults to `100vw`. This argument should be the proportion of the viewport widht the element (or it's parent) takes up, excluding fixed margins. If the element takes up 100% of the viewport except for a 50px margin on each side, the value here should still be `100vw`. Only pass a different value here if the image is not proportional to the entire viewport. If it should be `50vw` wide (excluding fixed margins) then pass `50vw`. (optional)

The following background image properties are added to the element using this mixin:

```css
background-size: cover;
background-repeat: no-repeat;
background-position: center;
```

<!-- @TODO: add multi-breakpoint examples -->
#### Example usage

```scss
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

[See the Demo](https://evanshunt.github.io/derekstrap/#proportional-text).

_This module is no longer enabled by default, as it produces [accessibility issues](https://gist.github.com/ChrissiQ/c1df2e455e7912700f7d06497f11bde5)_

This module sets the base sizing of text relative to viewport, with resets at each breakpoint defined and configured with the [Breakpoints](#Breakpoints) module. This allows layouts to behave more consistently with fewer odd issues caused by line wrapping. The breakpoint resets ensure the text does not huge on large screens.

To enable proportional text at the root level, set the config value `$use-root-proportional-text`.

'''scss
@use '~@evanshunt/derekstrap' with (
    $breakpointList: (
        $use-root-proportional-text: true
    )
);
'''

To enable it on a specific selector, use the placholder `%proportional-text`

```scss
.widget {
    @extend %proportional-text;
}
```

### Responsive Properties

[See the Demo](https://evanshunt.github.io/derekstrap/#responsive-properties).

This module provides a mixin to allow setting one or more css properties at multiple breakpoints with a shorthand syntax. 		This module sets the base sizing of text relative to viewport, with resets at each breakpoint defined and configured with the [Breakpoints](#Breakpoints) module. This allows layouts to behave more consistently with fewer odd issues caused by line wrapping. The breakpoint resets ensure the text does not huge on large screens.
#### Example usage		To enable proportional text at the root level, set the config value `$use-root-proportional-text`.
For a single CSS property.		'''scss
@use '~@evanshunt/derekstrap' with (
```scss		    $breakpointList: (
@use '~@evanshunt/derekstrap';		        $use-root-proportional-text: true
    )
.colored-text {		);
    @include derekstrap.responsive-properties(		'''
        'color',		
        (		
            'base': darkred,		
            'phone-large': chocolate,		
            'tablet': darkgoldenrod,		
            'desktop': green,		
            'desktop-large': navy,		
            'desktop-extra-large': purple		
        )		
    );		
}		
```		
For multiple CSS Properties 		To enable it on a specific selector, use the placholder `%proportional-text`
```scss		```scss
@use '~@evanshunt/derekstrap';		.widget {
    @extend %proportional-text;
h1 {		
    @include derekstrap.responsive-properties(		
        (		
            'font-size',		
            'margin-bottom'		
        ),		
        (		
            'base': (		
                2rem,		
                1rem		
            ),		
            'phone-large': (		
                2.5rem,		
                1rem		
            ),		
            'tablet': (		
                3rem,		
                1rem		
            ),		
            'desktop': (		
                4rem,		
                1.5rem		
            ),		
            'desktop-large': (		
                5rem,		
                2rem		
            ),		
            'desktop-extra-large': (		
                6rem,		
                3rem		
            ),		
        )		
    );		
}		}
```

### setUserAgent.js

When Derekstrap is imported and initialized it runs [setUserAgent.js](src/setUserAgent.js) which appends the browser user agent string to a `data-user-agent` attribute `html` element.

```js
import { Derekstrap} from '@evanshunt/derekstrap';
Derekstrap.init();
```

This will result in markup like the following:

```html
<html lang="en" data-useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15">
```

### Spacing

[See the Demo](https://evanshunt.github.io/derekstrap/#spacing).

The spacing module is a set of mixins for defining the whitespace around a block. It is intended to allow consistency across blocks, and for flexibility allows use of `padding`, `margin` or `left`/`right`/`top`/`bottom` attributes to create the whitespace. By default the mixins will apply to both top and bottom or both left and right, and will use the `padding` attribute, but this can be configured with optional arguments.

To standardize spacing across blocks it will be useful to define your own variable map of spacing using the same breakpoint names as used with the [Breakpoints](#Breakpoints) module.

#### Basic example usage

```scss
@use '~@evanshunt/derekstrap';

$regular-margins: (
    'base': 2rem,
    'phone-large': 4rem,
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

```scss
.content-block {
    // Applies spacing to the left side and zeros out the spacing on the right
    @include derekstrap.horizontal-spacing($regular-margins, 'left');
    // Applies spacing to the top, but does not set a bottom spacing
    @include derekstrap.vertical-spacing($section-spacing, 'top-only');
}
```

#### Changing the attribute

By default these methods use padding. The can be configured globally to use margins by passing a config value.

```scss
@use '~@evanshunt/derekstrap' with (
    $horizontal-spacing-attribute: 'margin',
    $vertical-spacing-attribute: 'margin'
);
```

The attribute can also be switched in any given call to the function by passing it as the third argument.

```scss
@include derekstrap.vertical-spacing($vertical-spacing, 'both', 'margin');
```

### Text Defaults

This module applies text style defaults and provides a system for setting the defaults via configuration variables. It is the only portion of Derekstrap which generates css by default without opting in or calling funtions.

You can preview the default text styles on [this HTML5 Kitchen Sink demo page](https://evanshunt.github.io/derekstrap/kitchen-sink.html)

A configuration variable is available to opt-out of these styles.

```scss
@use '~@evanshunt/derekstrap' with (
    $use-text-defaults: false
);
```

#### Configuring defaults

This module uses a large number of configurable default variables. These can be seen in the [variables](scss/text-defaults/_variables.scss) file. Most projects will likely need to modify default fonts and heading styles.

```scss
@use '~@evanshunt/derekstrap' with (
    $heading-font-family: Raleway, sans-serif,
    $heading-line-height: 1.3,
    $heading-font-color: colors.$light-grey,
    $h1-sizes: (
        'base': 36px,
        'phone-large': 40px,
        'tablet': 44px,
        'desktop': 52px,
        'desktop-large': 52px,
        'desktop-extra-large': 56px
    )
);
```

#### Responsive sizing

This module also includes a mixin that can be used to set the size of any selector the same way we set it for headings.

```scss
@use '~@evanshunt/derekstrap';

$blockquote-sizes: (
    'base': 18px,
    'phone-large': 20px,
    'tablet': 22px,
    'desktop': 24px,
    'desktop-large': 26px,
    'desktop-extra-large': 32px
);

blockquote {
    derekstrap.responsive-font-sizing($blockquote-sizes);
}
```
### @Todo: Document Utility module