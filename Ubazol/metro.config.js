const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// The app lives in /Ubazol and shared screens live in /src.
// Watch the workspace, but prevent shared files from resolving stale
// packages from /workspaces/freevps/node_modules. Resolve dependencies
// only from the app's own node_modules folder.
config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

module.exports = config;
