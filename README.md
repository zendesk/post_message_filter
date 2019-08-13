# postMessage filter

This repo contains a utility for sanitising Javascript objects before passing them to `postMessage`.

## Getting Started

Add to your `package.json` by

```sh
npm add post_message_filter
```

Then in your code

```js
import deleteNonClonable from 'post_message_filter/delete_non_clonable';

...

function postMessageWrapper(message, targetOrigin) {
  const filteredMessage = deleteNonClonable(message);
  postMessage(filteredMessage, targetOrigin);
}
```

## Building

The `delete_non_clonable.js` is the **build** file, the `.ts` file the source.

```sh
npm run build
```

## Browser Support

IE11, last two versions of Chrome, Edge, and Firefox.
