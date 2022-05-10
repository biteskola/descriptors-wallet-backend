"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const types_1 = require("../types");
// @ts-ignore
const bitcoinConfig = types_1.DEFAULT_BITCOIN_OPTIONS[process.env.BITCOIN_NETWORK];
console.log("cookieLocation", bitcoinConfig);
const credentials = fs_1.default.readFileSync(bitcoinConfig.cookie, { encoding: 'utf8', flag: 'r' });
const base64Auth = stringToBase64(credentials);
const config = {
    name: 'bitcoin',
    connector: 'rest',
    baseURL: `http://bitcoind:${bitcoinConfig.port}/`,
    /*  options: {
       headers: {
         'content-type': 'text/plain',
         Authorization: `Basic ${base64Auth}`,
       },
     }, */
    operations: [
        {
            template: {
                // must. JSONRPC server handles only POST requests
                method: 'POST',
                url: `http://bitcoind:${bitcoinConfig.port}/`,
                headers: {
                    'content-type': 'text/plain',
                    Authorization: `Basic ${base64Auth}`,
                },
                body: '{arg}',
            },
            functions: {
                callbitcoin: ['arg'],
            },
        },
    ],
};
function stringToBase64(str) {
    return Buffer.from(str).toString('base64');
}
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let BitcoinDataSource = class BitcoinDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
BitcoinDataSource.dataSourceName = 'bitcoin';
BitcoinDataSource.defaultConfig = config;
BitcoinDataSource = (0, tslib_1.__decorate)([
    (0, core_1.lifeCycleObserver)('datasource'),
    (0, tslib_1.__param)(0, (0, core_1.inject)('datasources.config.Bitcoin', { optional: true })),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], BitcoinDataSource);
exports.BitcoinDataSource = BitcoinDataSource;
//# sourceMappingURL=bitcoin.datasource.js.map