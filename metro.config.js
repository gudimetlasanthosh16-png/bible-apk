const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'bin' to assetExts so it is bundled as a file, not code
config.resolver.assetExts.push('bin');

module.exports = config;
