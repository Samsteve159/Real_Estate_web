// Metro config — alias "@manifest/core" to the vendored copy of the shared
// package (src/core), synced from the canonical ../core via scripts/sync-core.mjs.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const coreEntry = path.resolve(projectRoot, "src/core/index.ts");

const config = getDefaultConfig(projectRoot);

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@manifest/core") {
    return { type: "sourceFile", filePath: coreEntry };
  }
  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
