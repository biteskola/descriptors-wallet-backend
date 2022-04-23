"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const service_proxy_1 = require("@loopback/service-proxy");
const bitcoin_datasource_1 = require("../datasources/bitcoin.datasource");
let BitcoinProvider = class BitcoinProvider {
    constructor(
    // bitcoin must match the name property in the datasource json file
    dataSource = new bitcoin_datasource_1.BitcoinDataSource()) {
        this.dataSource = dataSource;
    }
    value() {
        return (0, service_proxy_1.getService)(this.dataSource);
    }
};
BitcoinProvider = (0, tslib_1.__decorate)([
    (0, tslib_1.__param)(0, (0, core_1.inject)('datasources.bitcoin')),
    (0, tslib_1.__metadata)("design:paramtypes", [bitcoin_datasource_1.BitcoinDataSource])
], BitcoinProvider);
exports.BitcoinProvider = BitcoinProvider;
//# sourceMappingURL=bitcoin.service.js.map