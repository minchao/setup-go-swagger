"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = require("@actions/core");
const path = require("path");
const util_1 = require("./util");
const swaggerName = 'swagger';
async function run() {
    let version = core.getInput('version', { required: true });
    if (version.toLocaleLowerCase() === 'latest') {
        version = await util_1.getSwaggerLatestVersion();
    }
    const cachedPath = await util_1.downloadSwagger(swaggerName, version);
    core.addPath(path.dirname(cachedPath));
    console.log(`go-swagger version: '${version}' has been installed at ${cachedPath}`);
    core.setOutput('go-swagger-path', cachedPath);
}
exports.run = run;
run().catch(core.setFailed);
