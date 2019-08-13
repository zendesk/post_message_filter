// http://stackoverflow.com/a/32673910/1911487
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const unclonableSentinel = Object.freeze({});

const toString: () => string = Object.prototype.toString;

function toStringForObject(object: any): string {
  const type: string = toString.call(object).slice(8, -1);
  if (!object) {
    return type;
  }
  // IE11 bug
  if (object.constructor === Set) {
    return 'Set';
  } else if (object.constructor === Map) {
    return 'Map';
  }
  return type;
}

interface XHRObject {
  readyState: number
  status: string
  statusText: string
  response?: string
  responseText?: string
  responseJSON?: object
}

export default function deleteNonClonable(obj: any, depth: number = 0) {
  if (depth >= 99) {
    // recursed 100 times, we're probably hanging forever
    throw new Error('Possible infinite recursion in postMessage argument.');
  }

  if (Object(obj) !== obj) { // check for primitive values
    return obj;
  }

  const type = toStringForObject(obj);
  switch (type) {
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'RegExp':
    case 'Blob':
    case 'File':
    case 'FileList':
    case 'ArrayBuffer':
    case 'ImageData':
    case 'DataView':
      return obj;
    case 'Array':
      return (obj as Array<any>).map(arrayObj => deleteNonClonable(arrayObj, depth + 1)).filter(arrayObj => arrayObj !== unclonableSentinel);
    case 'Object':
      return Object.keys(obj).reduce((clonableObj, currentKey) => {
        const newVal = deleteNonClonable(obj[currentKey], depth + 1);
        if (newVal !== unclonableSentinel) {
          clonableObj[currentKey] = newVal;
        }
        return clonableObj;
      }, {});
    case 'Map': {
      const newMap = new Map();
      (obj as Map<any, any>).forEach((value, key) => {
        const newKey = deleteNonClonable(key, depth + 1);
        if (newKey === unclonableSentinel) {
          return;
        }
        const newValue = deleteNonClonable(value, depth + 1);
        if (newValue === unclonableSentinel) {
          return;
        }
        newMap.set(newKey, newValue);
      });
      return newMap;
    }
    case 'Set': {
      const newSet = new Set();
      (obj as Set<any>).forEach(value => {
        const newValue = deleteNonClonable(value, depth + 1);
        if (newValue !== unclonableSentinel) {
          newSet.add(newValue);
        }
      });
      return newSet;
    }
    case 'XMLHttpRequest':
      const newXHR: XHRObject = {
        readyState: obj.readyState,
        status: obj.status,
        statusText: obj.statusText
      };

      if (obj.responseType === 'arraybuffer' || obj.responseType === 'blob')
        newXHR.response = obj.response;
      else
        newXHR.responseText = obj.responseText;

      try {
        newXHR.responseJSON = JSON.parse(obj.responseText);
      } catch (error) {};

      return newXHR;
    default:
      if (/^(?:Int|Uint|Float)(?:8|16|32|64)Array$/.test(type)) {
        // close enough to https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView
        return obj;
      }
      return unclonableSentinel;
  }
}
