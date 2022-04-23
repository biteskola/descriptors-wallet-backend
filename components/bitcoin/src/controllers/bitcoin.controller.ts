import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {Bitcoin} from '..';
import {basicAuthorization} from '../../../../dist/middlewares/auth.midd';
import {SECURITY_SPEC} from '../../../../dist/utils/security-spec';
import {BitcoinRequestBody, Request} from './specs/bitcoin-controller.specs';

export class BitcoinController {
  constructor(
    @inject('services.Bitcoin') protected queryService: Bitcoin,
  ) { }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'member', 'user'],
    voters: [basicAuthorization],
  })
  @post('/bitcoin', {
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Call to any bitcoin-core RPC',
        content: {'application/json': {schema: getModelSchemaRef(Object)}},
      },
    },
  })

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
  async callBitcoin(@requestBody(BitcoinRequestBody) req: Request,
  ): Promise<Object> {
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
}
