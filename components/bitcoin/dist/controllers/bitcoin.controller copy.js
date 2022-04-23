"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBitcoinController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
function getHealthResponseObject() {
    /**
     * OpenAPI definition of health response schema
     */
    const HEALTH_RESPONSE_SCHEMA = {
        type: 'object',
        properties: {
            status: { type: 'string' },
            checks: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        state: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                reason: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    };
    /**
     * OpenAPI definition of health response
     */
    const HEALTH_RESPONSE = {
        description: 'Health Response',
        content: {
            'application/json': {
                schema: HEALTH_RESPONSE_SCHEMA,
            },
        },
    };
    return HEALTH_RESPONSE;
}
/**
 * OpenAPI spec for health endpoints
 */
const HEALTH_SPEC = {
    // response object needs to be cloned because the oas-validator throws an
    // error if the same object is referenced twice
    responses: {
        '200': getHealthResponseObject(),
        '500': getHealthResponseObject(),
        '503': getHealthResponseObject(),
    },
};
/**
 * OpenAPI spec to hide endpoints
 */
const HIDDEN_SPEC = {
    responses: {},
    'x-visibility': 'undocumented',
};
/**
 * A factory function to create a controller class for health endpoints. This
 * makes it possible to customize decorations such as `@get` with a dynamic
 * path value not known at compile time.
 *
 * @param options - Options for health endpoints
 */
function createBitcoinController(options) {
    console.log("ENTA");
    // const spec = options.openApiSpec ? HEALTH_SPEC : HIDDEN_SPEC;
    const spec = HEALTH_SPEC;
    /**
     * Controller for health endpoints
     */
    let BitcoinController = class BitcoinController {
        constructor(
        /*  @inject(HealthBindings.HEALTH_CHECKER)
         private healthChecker: HealthChecker, */
        ) { }
        async health(response) {
            console.log("pasa");
            return true;
        }
    };
    (0, tslib_1.__decorate)([
        (0, rest_1.get)("/health", spec),
        (0, tslib_1.__param)(0, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BitcoinController.prototype, "health", null);
    BitcoinController = (0, tslib_1.__decorate)([
        (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
        (0, tslib_1.__metadata)("design:paramtypes", [])
    ], BitcoinController);
    return BitcoinController;
}
exports.createBitcoinController = createBitcoinController;
//# sourceMappingURL=bitcoin.controller%20copy.js.map