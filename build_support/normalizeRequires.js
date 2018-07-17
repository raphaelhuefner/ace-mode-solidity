const path = require('path');

function normalizeRequires(fileId, requires) {
  let dir = path.dirname(fileId);
  let normalized = [];
  for (let require of requires) {
    normalized.push(path.join(dir, require));
  }
  return normalized;
}

module.exports = normalizeRequires;
