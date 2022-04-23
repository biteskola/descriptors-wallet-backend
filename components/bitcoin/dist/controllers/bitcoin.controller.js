"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const auth_midd_1 = require("../../../../dist/middlewares/auth.midd");
const security_spec_1 = require("../../../../dist/utils/security-spec");
const bitcoin_controller_specs_1 = require("./specs/bitcoin-controller.specs");
let BitcoinController = class BitcoinController {
    constructor(queryService) {
        this.queryService = queryService;
    }
    /*
    {
      "method": "getblockhash",
      "params": [0]
    }
    {
      "method": "getblock",
      "params": ["0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206"]
    }
    {
      "method": "getblockchaininfo",
      "params": []
    }
    */
    async callBitcoin(req) {
        console.log("req", req);
        const request = await this.queryService.dataSource.callbitcoin(JSON.stringify(req));
        return JSON.parse(request);
        /* const body: Request = {
          method: 'getblockcount',
          params: [],
        };
        const count = await this.queryService.dataSource.callbitcoin(JSON.stringify(body));
        const body2: Request = {
          method: 'getblockhash',
          params: [0],
        };
        const a2 = await this.queryService.dataSource.callbitcoin(JSON.stringify(body2));
        const blockHash = JSON.parse(a2).result
        const body3: Request = {
          method: 'getblock',
          params: [blockHash],
        };
        const a3 = await this.queryService.dataSource.callbitcoin(JSON.stringify(body3));
        console.log('a2', blockHash);
        console.log('a3', JSON.parse(a3));
        return JSON.parse(count); */
    }
};
(0, tslib_1.__decorate)([
    (0, authentication_1.authenticate)('jwt'),
    (0, authorization_1.authorize)({
        allowedRoles: ['admin', 'member', 'user'],
        voters: [auth_midd_1.basicAuthorization],
    }),
    (0, rest_1.post)('/bitcoin', {
        security: security_spec_1.SECURITY_SPEC,
        responses: {
            '200': {
                description: 'Call to any bitcoin-core RPC',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(Object) } },
            },
        },
    }),
    (0, tslib_1.__param)(0, (0, rest_1.requestBody)(bitcoin_controller_specs_1.BitcoinRequestBody)),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], BitcoinController.prototype, "callBitcoin", null);
BitcoinController = (0, tslib_1.__decorate)([
    (0, tslib_1.__param)(0, (0, core_1.inject)('services.Bitcoin')),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], BitcoinController);
exports.BitcoinController = BitcoinController;
//# sourceMappingURL=bitcoin.controller.js.map