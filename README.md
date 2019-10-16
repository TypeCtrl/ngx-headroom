<div align="center">
  <h1>ngx-headroom</h1>
  <br>
  <a href="https://www.npmjs.com/package/@ctrl/ngx-headroom">
    <img src="https://badge.fury.io/js/%40ctrl%2Fngx-headroom.svg" alt="npm">
  </a> 
  <a href="https://circleci.com/gh/TypeCtrl/ngx-headroom">
    <img src="https://circleci.com/gh/TypeCtrl/ngx-headroom.svg?style=svg" alt="circleci">
  </a> 
  <a href="https://codecov.io/github/typectrl/ngx-headroom">
    <img src="https://img.shields.io/codecov/c/github/typectrl/ngx-headroom.svg" alt="codecov">
  </a>
  <br>
  <br>
</div>

DEMO: https://ngx-headroom.netlify.com/

An Angular Component to hide/show your header on scroll. A port of of [React Headroom](https://github.com/KyleAMathews/react-headroom) by KyleAMathews which was based around [headroom.js](https://github.com/WickyNilliams/headroom.js)

Fixed headers are nice for persistent navigation but they can also get in the way by taking up valuable vertical screen space. Using this component lets you have your persistent navigation while preserving screen space when the navigation is not needed.

## Dependencies
Latest version available for each version of Angular

| ngx-headroom | Angular     |
| ------------ | ----------- |
| 2.3.2        | 6.x 7.x     |
| current      | >= 8.x      |

## Install

```sh
npm install @ctrl/ngx-headroom
```

## Using Angular Headroom
Import the module. Requires `@angular/animations`
```ts
// requires BrowserAnimationsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import HeadroomModule
import { HeadroomModule } from '@ctrl/ngx-headroom';
```

Use the module
```html
<ngx-headroom>
  <h1>You can put anything you'd like inside the Headroom Component</h1>
</ngx-headroom>
```

### Overriding animation

The component is intended to be plug 'n play meaning it has sensible defaults for animating the header in and out. If you'd like to override the default animation.

Override animation defaults by passing your own values

```html
<ngx-headroom duration="500" easing="ease-in-out">
  <h1>You can put anything you'd like inside the Headroom Component</h1>
</ngx-headroom>
```

### Inputs

*   `duration` — Duration of animation in ms
*   `easing` — Easing of animation
*   `upTolerance` — scroll tolerance in px when scrolling up before component is pinned
*   `downTolerance` — scroll tolerance in px when scrolling down before component is pinned
*   `disable` — disable pinning and unpinning
*   `wrapperStyle` — pass styles for the wrapper div (this maintains the components vertical space at the top of the page).
*   `parent` — provide a custom 'parent' element for scroll events. `parent` should be a function which resolves to the desired element.
*   `pinStart` — height in px where the header should start and stop pinning. Useful when you have another element above Headroom component.

### Outputs

*   `pin` - emitted when header is pinned
*   `unpin` - emitted when header is unpinned
*   `unfix` - emitted when header position is no longer fixed

---

> GitHub [@scttcper](https://github.com/scttcper) &nbsp;&middot;&nbsp;
> Twitter [@scttcper](https://twitter.com/scttcper)
