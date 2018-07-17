# ace/mode/solidity

[![Build Status](https://travis-ci.org/raphaelhuefner/ace-mode-solidity.svg?branch=master)](https://travis-ci.org/raphaelhuefner/ace-mode-solidity) [![npm version](https://badge.fury.io/js/ace-mode-solidity.svg)](https://badge.fury.io/js/ace-mode-solidity)

[Ace](https://ace.c9.io/) Edit Mode for [Ethereum's Solidity language](https://solidity.readthedocs.io/en/latest/).

- The [`build`](./build/) directory holds prebuilt versions of the Solidity edit mode like you would find in the [ace-builds](https://github.com/ajaxorg/ace-builds/) repository.
- The [`build/legacy`](./build/legacy/) directory has older versions which were built with a re-created ACE build process which does not crash on recent Node.js versions.
  - (At least for me, the ACE build fails <=v1.2.3 on my Node.js v8.11.3 . Re-creating that build process was a very good AST lesson for me, I'm happy I took that detour.)
- As an added bonus, the `legacy` directory has also [brace](https://www.npmjs.com/package/brace) (ACE for browserify) versions, look for `src-brace` subdirs.
- Please do not wonder about any `mode-javascript.js` files, they only exist to ensure the 2 build processes are consistent.
- Currently the only tested build is `build/remix-ide/mode-solidity.js` because the main focus is to enable [Remix IDE](https://github.com/ethereum/remix-ide) to start using this NPM package. See [this GitHub issue](https://github.com/ethereum/remix-ide/issues/1359) for the progress on that.
- After that transition succeeded I will extend the tests to the other ACE versions.
- No support for EVM assembly yet.
