import {
  Application, BindingScope, Component,
  config,
  ContextTags,
  CoreBindings,
  inject, injectable
} from '@loopback/core';
import {BitcoinController} from './controllers';
import {BitcoinDataSource} from './datasources';
import {BitcoinComponentBindings} from './keys';
import {BitcoinProvider} from './services';
import {BitcoinComponentOptions, DEFAULT_BITCOIN_OPTIONS} from './types';

// Configure the binding for BitcoinComponent
@injectable({tags: {[ContextTags.KEY]: BitcoinComponentBindings.COMPONENT}})
export class BitcoinComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: BitcoinComponentOptions = DEFAULT_BITCOIN_OPTIONS,
  ) {
    console.log("bitcoin component mounted!");

    this.application
      .bind('services.Bitcoin')
      .toClass(BitcoinProvider)
      .inScope(BindingScope.SINGLETON);

    this.application
      .bind('datasources.bitcoin')
      .toClass(BitcoinDataSource)
      .inScope(BindingScope.SINGLETON);


    const componentOptions: any = {
      // ...DEFAULT_HEALTH_OPTIONS,
      // ...healthConfig,
    };
    if (!componentOptions.disabled) {
      this.application.controller(BitcoinController);
    }
  }
}
