# 0.1.1 / 2018-11-21

* Update version of indirect dependency [`cached-path-relative`](https://www.npmjs.com/package/cached-path-relative) in `package-lock.json` from `1.0.1` to `1.0.2` due to [CVE-2018-16472](https://nvd.nist.gov/vuln/detail/CVE-2018-16472).

# 0.1.0 / 2018-07-17

* First minor version release as sign of commitment to having `build/remix-ide/mode-solidity.js` as entry point for Remix IDE.

# 0.0.1-alpha.4 / 2018-07-17

* Add 2 build systems
  1. piggy-backing on the actual ACE build system
  2. re-creating the ACE build system to be able to build legacy versions.
* Bug fixes in Solidity syntax highlighter.

# 0.0.1-alpha.3 / 2018-07-12

* Remove `reports` subdir from `.npmignore`

# 0.0.1-alpha.2 / 2018-07-12

* Majority of refactoring:
  - Remove cruft left over from copy'n'pasting `ace/mode/javascript`
  - Add missing Solidity syntax highlighting 
  - Correct wrong Solidity syntax highlighting 

# 0.0.1-alpha.1 / 2018-06-16

* Claim NPM package name
* Copied `mode-solidity.js` from https://github.com/ethereum/remix-ide/blob/d8664909c1180e0095bec6b5c83f6a69c29b34a3/src/app/editor/mode-solidity.js
* Fixed mode name from copy'n'pasted `ace/mode/javascript` to `ace/mode/solidity`
