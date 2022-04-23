import {BindingKey, CoreBindings} from '@loopback/core';
import {BitcoinComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace BitcoinComponentBindings {
  export const COMPONENT = BindingKey.create<BitcoinComponent>(
    `${CoreBindings.COMPONENTS}.BitcoinComponent`,
  );
}
