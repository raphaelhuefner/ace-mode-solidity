const buildWithAce = require('./build_support/buildWithAce.js');
const buildLegacy = require('./build_support/buildLegacy.js');
const buildForRemixIde = require('./build_support/buildForRemixIde.js');

buildWithAce();
buildLegacy();
// TODO test that the results of buildWithAce() and buildLegacy() are the same for 1.2.4 - 1.3.3
buildForRemixIde();
