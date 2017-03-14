# postMessage filter

This repo contains a utility for sanitising Javascript objects before passing them to `postMessage`.

## Getting Started

Add to your `package.json` by

```sh
yarn add postMessage-filter
```

Then in your code

```js
import { deleteNonClonable } from 'postMessage-filter';

...

function postMessageWrapper(message, targetOrigin) {
  const filteredMessage = deleteNonClonable(message);
  postMessage(filteredMessage, targetOrigin);
}
```

## Building

```sh
yarn build
```

## Browser Support

IE11, last two versions of Chrome, Edge, and Firefox.
