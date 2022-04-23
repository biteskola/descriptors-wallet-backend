import {BindingScope, inject, injectable} from '@loopback/core';
import {
    get,
    OperationObject,
    Response, ResponseObject, RestBindings,
    SchemaObject
} from '@loopback/rest';

function getHealthResponseObject() {
    /**
     * OpenAPI definition of health response schema
     */
    const HEALTH_RESPONSE_SCHEMA: SchemaObject = {
        type: 'object',
        properties: {
            status: {type: 'string'},
            checks: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {type: 'string'},
                        state: {type: 'string'},
                        data: {
                            type: 'object',
                            properties: {
                                reason: {type: 'string'},
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
    const HEALTH_RESPONSE: ResponseObject = {
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
const HEALTH_SPEC: OperationObject = {
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
const HIDDEN_SPEC: OperationObject = {
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
export function createBitcoinController(
    options: any,
): any {
    console.log("ENTA")
    // const spec = options.openApiSpec ? HEALTH_SPEC : HIDDEN_SPEC;
    const spec = HEALTH_SPEC;

    /**
     * Controller for health endpoints
     */
    @injectable({scope: BindingScope.SINGLETON})
    class BitcoinController {
        constructor(
            /*  @inject(HealthBindings.HEALTH_CHECKER)
             private healthChecker: HealthChecker, */
        ) { }

        @get("/health", spec)
        async health(@inject(RestBindings.Http.RESPONSE) response: Response) {
            console.log("pasa");
            return true;
        }
    }

    return BitcoinController;
}
