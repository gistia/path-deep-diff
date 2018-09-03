const _ = require('lodash');
const diff = require('deep-diff').diff;
const flatten = (target, opts) => {
  opts = opts || {};

  var delimiter = opts.delimiter || '.';
  var maxDepth = opts.maxDepth;
  var output = {};

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth ? currentDepth : 1;
    Object.keys(object).forEach(key => {
      var value = object[key];
      var isarray = opts.safe && Array.isArray(value);
      var type = Object.prototype.toString.call(value);
      var isbuffer = false;
      var isobject = type === '[object Object]' || type === '[object Array]';

      var newKey = prev ? prev + delimiter + key : key;

      if (
      !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
    ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output;
};

const getDiffs = (oldValue, newValue, { whiteList=[] } = {}) => {
  oldValue = oldValue || {};
  const diffs = diff(oldValue, newValue, true) || [];

  const handleDeletions = d => {
    const path = d.path ? d.path.join('.') : '';
    return _.isObject(d.lhs) ? Object.keys(flatten(d.lhs)).map(key => `${path}.${key}`) : path;
  };

  const handlNewValues = d => {
    const path = d.path ? d.path.join('.') : '';
    return _.isObject(d.rhs) ? Object.keys(flatten(d.rhs)).map(key => `${path}.${key}`) : path;
  };

  const handleEdition = d => {
    return d.path.join('.');
  };

  const handleArray = d => {
    const path = d.path ? d.path.join('.') : '';
    const handler = handlers[d.item.kind];
    return _.castArray(handler(d.item)).map(key => `${path}.${d.index}${key}`);
  };

  const handleDiff = d => {
    const handler = handlers[d.kind];
    return handler(d);
  };

  const handlers = {
    D: handleDeletions,
    E: handleEdition,
    N: handlNewValues,
    A: handleArray,
  };

  const allDiffs = diffs.filter(d => d.path).map(handleDiff);

  return _(allDiffs)
    .flatten()
    .reject(el => _.some(whiteList, item => el.includes(item)))
    .value();
}

module.exports = getDiffs;
