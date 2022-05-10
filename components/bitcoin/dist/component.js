"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const controllers_1 = require("./controllers");
const datasources_1 = require("./datasources");
const keys_1 = require("./keys");
const services_1 = require("./services");
const types_1 = require("./types");
// Configure the binding for BitcoinComponent
let BitcoinComponent = class BitcoinComponent {
    constructor(application, options = types_1.DEFAULT_BITCOIN_OPTIONS) {
        this.application = application;
        this.options = options;
        console.log("bitcoin component mounted!");
        this.application
            .bind('services.Bitcoin')
            .toClass(services_1.BitcoinProvider)
            .inScope(core_1.BindingScope.SINGLETON);
        this.application
            .bind('datasources.bitcoin')
            .toClass(datasources_1.BitcoinDataSource)
            .inScope(core_1.BindingScope.SINGLETON);
        const componentOptions = {
        // ...DEFAULT_HEALTH_OPTIONS,
        // ...healthConfig,
        };
        if (!componentOptions.disabled) {
            this.application.controller(controllers_1.BitcoinController);
        }
    }
};
BitcoinComponent = (0, tslib_1.__decorate)([
    (0, core_1.injectable)({ tags: { [core_1.ContextTags.KEY]: keys_1.BitcoinComponentBindings.COMPONENT } }),
    (0, tslib_1.__param)(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    (0, tslib_1.__param)(1, (0, core_1.config)()),
    (0, tslib_1.__metadata)("design:paramtypes", [core_1.Application, Object])
], BitcoinComponent);
exports.BitcoinComponent = BitcoinComponent;
//# sourceMappingURL=component.js.map