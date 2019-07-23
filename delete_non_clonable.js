"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// http://stackoverflow.com/a/32673910/1911487
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
var unclonableSentinel = Object.freeze({});
var toString = Object.prototype.toString;
function toStringForObject(object) {
    var type = toString.call(object).slice(8, -1);
    if (!object) {
        return type;
    }
    // IE11 bug
    if (object.constructor === Set) {
        return 'Set';
    }
    else if (object.constructor === Map) {
        return 'Map';
    }
    return type;
}
function deleteNonClonable(obj, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth >= 99) {
        // recursed 100 times, we're probably hanging forever
        throw new Error('Possible infinite recursion in postMessage argument.');
    }
    if (Object(obj) !== obj) { // check for primitive values
        return obj;
    }
    var type = toStringForObject(obj);
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
            return obj.map(function (arrayObj) { return deleteNonClonable(arrayObj, depth + 1); }).filter(function (arrayObj) { return arrayObj !== unclonableSentinel; });
        case 'Object':
            return Object.keys(obj).reduce(function (clonableObj, currentKey) {
                var newVal = deleteNonClonable(obj[currentKey], depth + 1);
                if (newVal !== unclonableSentinel) {
                    clonableObj[currentKey] = newVal;
                }
                return clonableObj;
            }, {});
        case 'Map': {
            var newMap_1 = new Map();
            obj.forEach(function (value, key) {
                var newKey = deleteNonClonable(key, depth + 1);
                if (newKey === unclonableSentinel) {
                    return;
                }
                var newValue = deleteNonClonable(value, depth + 1);
                if (newValue === unclonableSentinel) {
                    return;
                }
                newMap_1.set(newKey, newValue);
            });
            return newMap_1;
        }
        case 'Set': {
            var newSet_1 = new Set();
            obj.forEach(function (value) {
                var newValue = deleteNonClonable(value, depth + 1);
                if (newValue !== unclonableSentinel) {
                    newSet_1.add(newValue);
                }
            });
            return newSet_1;
        }
        case 'XMLHttpRequest':
            var newXHR = {
                readyState: obj.readyState,
                responseText: obj.responseText,
                status: obj.status,
                statusText: obj.statusText
            };
            try {
                newXHR.responseJSON = JSON.parse(obj.responseText);
            }
            catch (error) { }
            ;
            return newXHR;
        default:
            if (/^(?:Int|Uint|Float)(?:8|16|32|64)Array$/.test(type)) {
                // close enough to https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView
                return obj;
            }
            return unclonableSentinel;
    }
}
exports.default = deleteNonClonable;
