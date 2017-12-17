<div align="center">
  <h1>ngx-headroom</h1>
  <br>
  <a href="https://www.npmjs.org/package/@ctrl/ngx-headroom">
    <img src="https://badge.fury.io/js/@ctrl/ngx-headroom.svg" alt="npm">
  </a> 
  <a href="https://travis-ci.org/typectrl/ngx-headroom">
    <img src="https://travis-ci.org/typectrl/ngx-headroom.svg?branch=master" alt="travis"></a> 
  <a href="https://codecov.io/github/typectrl/ngx-headroom">
    <img src="https://img.shields.io/codecov/c/github/typectrl/ngx-headroom.svg" alt="codecov">
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/typectrl/ngx-headroom.svg" alt="greenkeeper">
  </a>
  <br>
  DEMO: https://typectrl.github.io/ngx-headroom/
</div>
<br>
<br>

This is a port of (React Headroom)[https://github.com/KyleAMathews/react-headroom] by KyleAMathews. This is an Angular Component to hide/show your header on scroll.

Fixed headers are nice for persistent navigation but they can also get in the way by taking up valuable vertical screen space. Using this component lets you have your persistent navigation while preserving screen space when the navigation is not needed.

## Install

`npm install @ctrl/ngx-headroom`

## Using Angular Headroom
Import the module
```typescript
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

```javascript
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
