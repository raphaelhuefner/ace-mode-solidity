const semver = require('semver');

function codeTemplate(defineNamespace, fileId, codeExportsTest) {
  // The awkward whitespace formatting is to satisfy `git diff`.
  return (
`                (function() {
                    ${defineNamespace}.require(["${fileId}"], function(m) {
                        if (typeof module == "object"${codeExportsTest}) {
                            module.exports = m;
                        }
                    });
                })();
            `
  );
}

/**
 * Add module.exports suffix as in the original ACE build process, >=1.3.2 .
 */
function getExportsSuffix(version, fileId, defineNamespace) {
  version = semver.coerce(version);
  if (semver.lt(version, semver('1.3.2'))) {
    return '';
  }
  defineNamespace = defineNamespace ? defineNamespace : 'window';
  codeExportsTest = semver.gte(version, semver('1.3.3')) ? ' && typeof exports == "object" && module' : '';
  let suffix = codeTemplate(defineNamespace, fileId, codeExportsTest);
  return suffix;
}

module.exports = getExportsSuffix;
