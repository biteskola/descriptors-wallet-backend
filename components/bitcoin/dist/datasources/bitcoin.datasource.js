"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const types_1 = require("../types");
const { execSync } = require('child_process');
const a = execSync('ls -las /bitcoin/.bitcoin/regtest/; pwd');
console.log("a", a);
// @ts-ignore
const bitcoinConfig = types_1.DEFAULT_BITCOIN_OPTIONS[process.env.BITCOIN_NETWORK];
console.log("cookieLocation", bitcoinConfig);
// const credentials = fs.readFileSync(bitcoinConfig.cookie, {encoding: 'utf8', flag: 'r'});
const base64Auth = stringToBase64("btc:c3a30d88c1ff98017b55846917d433$d4634b459dae50b34656479c0a10f68b2c5da3d122cfb14d93ab5b9c4ae83dc0");
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