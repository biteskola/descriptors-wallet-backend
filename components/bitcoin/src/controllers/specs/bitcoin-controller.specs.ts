import {model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';

@model()
export class BitcoinRequest {
  @property({
    type: 'string',
    required: true,
  })
  method: string;

  @property({
    type: 'array',
    required: true,
    itemType: 'any',
  })
  params: Array<string | number>;
}

export const BitcoinRequestBody = {
  description: 'Request data',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(BitcoinRequest),
    },
  },
};

export type Request = {
  method: string;
  params: string[] | number[];
};
