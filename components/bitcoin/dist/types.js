"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BITCOIN_OPTIONS = void 0;
const basePath = '/bitcoin/.bitcoin';
/**
* Default options for the component
*/
exports.DEFAULT_BITCOIN_OPTIONS = {
    mainnet: {
        cookie: `${basePath}/.cookie`,
        port: 8332
    },
    testnet: {
        cookie: `${basePath}/testnet3/.cookie`,
        port: 18332
    },
    regtest: {
        cookie: `${basePath}/regtest/.cookie`,
        port: 18443
    },
    signet: {
        cookie: `${basePath}/signet/.cookie`,
        port: 38332
    }
};
//# sourceMappingURL=types.js.map