if (typeof globalThis.DOMException === 'undefined') {
  globalThis.DOMException = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}
globalThis.NativeDOMException = globalThis.DOMException;


if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = function (obj) {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}