import {
  TokenService,
  UserService
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  Request,
  requestBody,
  RestBindings
} from '@loopback/rest';
import axios from 'axios';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasher} from '../services';
import {SECURITY_SPEC} from '../utils/security-spec';

/*
  M para Model => MAddress (modelo de Address)
  Req para Request => ReqAddress (request de Address)
  Res para Response => ReqAddress (response de Address)
*/
@model()
class MAddress {
  @property({
    type: 'string',
    required: true,
  })
  address: string;
}

const ReqAddress = {
  description: 'The input for addresss',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(MAddress),
    },
  },
};

@model()
class MDescriptor {
  @property({
    type: 'string',
    required: true,
  })
  descriptor: string;
}

const ReqDescriptor = {
  description: 'The input for descriptors',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(MDescriptor),
    },
  },
};

class ResAddress {
  /* @property({
    type: 'string',
    required: true,
  })
  pubkey: string; */

  @property({
    type: 'string',
    required: true,
  })
  address: string;
}

const ResDescriptorByAddresses = {
  description: 'Server status',
  content: {
    'application/json': {
      schema: {
        title: 'StatusResponse',
        type: 'array',
        items: {
          'x-ts-type': MAddress,
          /* type: 'object',
          properties: {
            pubkey: {
              type: 'string',
              required: true
            },
            address: {
              type: 'string',
              required: true
            }
          }, */
        },
      },
    },
  },
}

@model()
class MBalance {
  @property()
  confirmed: number;

  @property()
  unconfirmed: number;
}

@model()
class MTransaction {
  @property()
  pubkey: string;

  @property()
  address: string;

  @property()
  txid: string;
}

@model()
class MUtxo {
  @property()
  txid: string;

  @property()
  vout: number;
}

class ResAddresses {
  @property({
    type: 'object',
    required: true,
  })
  balance: MBalance;

  @property({
    type: 'object',
    required: true,
  })
  transactions: Array<MTransaction>;

  @property({
    type: 'object',
    required: true,
  })
  utxos: Array<MUtxo>;
}

const ResAddressInfoByAddresses = {
  description: 'Server status',
  content: {
    'application/json': {
      schema: {
        title: 'StatusResponse',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            balance: {
              'x-ts-type': MBalance,
              required: true
            },
            transactions: {
              type: 'array',
              items: {
                'x-ts-type': MTransaction
              }
            },
            utxos: {
              type: 'array',
              items: {
                'x-ts-type': MUtxo
              }
            }
          },
        },
      },
    },
  },
}

export class DescriptorsController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(RestBindings.Http.REQUEST)
    private req: Request,
  ) { }

  @post('addresses/{descriptor}', {
    security: SECURITY_SPEC,
    summary: 'Get all addresses by descriptor',
    responses: {
      '200': ResDescriptorByAddresses
    },
  })

  // @authenticate('jwt')
  /* @authorize({
        allowedRoles: ['admin'],
        voters: [basicAuthorization],
      }) */
  async getAddressesByDescriptor(
    // wpkh(036ea52f664d8e90ab757391af84e9ab783327f67fa83025e401fc72946b070219)#ytrywtsw => bcrt1qlftq0pjd9tp284kzm0xzykr2lus9ckqju7mk0z
    // wpkh([4325da1f]023cf230d519ec9ad6cb9f458a71591946f98c9f470274087de3fa0aa67523e39f)#3aa46c0e => bcrt1qgvja58u80zhnvydvyz5873vk80stzk8y0l2080
    // pk(0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798)#gn28ywm7 => mrCDrCybB6J1vRfbwM5hemdJz73FwDBC8r
    @requestBody(ReqDescriptor) ReqDescriptor: MDescriptor,
  ): Promise<Array<ResAddress>> {
    console.log("descriptorRequest", ReqDescriptor.descriptor)

    // deriveaddress => bitcoin-cli --regtest
    // TODO: If not #checsum, call bitcoin-cli --regtest getdescriptorinfo
    const body = {
      "method": "deriveaddresses",
      "params": [ReqDescriptor.descriptor]
    }

    // TODO: Crear una clase en core que se llame JWT.getTokenFromRequest?
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkOTU5NmU3LTUzNzktNDY3Ny05ZWIwLTUyYzJhN2NlOGI3NyIsInJvbGUiOiJmaXJzdEFkbWluIiwiaWF0IjoxNjUyMjIxNTEzLCJleHAiOjE2NTIyNTc1MTN9.YkCI4Vl2MzmcrZoBDPVyo4_inJVIFWhP8rP-S0SK-j0';
    const resp = await axios({
      method: 'post',
      url: 'http://localhost:3000/bitcoin',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      data: body
    });

    if (resp.data.error) {
      throw new Error(`Error happens!, ${resp.data.error}`);
    }

    console.log("resp", resp.data, resp.data.result)

    // RESPONSE: [ 'address1', 'address2', 'address3' }]

    return resp.data.result;
  }

  @post('addressInfo/{address}', {
    security: SECURITY_SPEC,
    summary: 'Get information of an address',
    responses: {
      '200': ResAddressInfoByAddresses
    },
  })

  // @authenticate('jwt')
  /* @authorize({
        allowedRoles: ['admin'],
        voters: [basicAuthorization],
      }) */
  async getAddressesInfo(
    @requestBody(ReqAddress) ReqAddress: MAddress,
  ): Promise<Array<ResAddresses>> {
    console.log("addressRequest", ReqAddress)

    // ElectrumClient.blockchainScripthash_getbalance(address)
    // ElectrumClient.blockchainScripthash_gethistory(address)
    // ElectrumClient.blockchainScripthash_listunspent(address)
    // RESPONSE: [{type: 'receive' / 'change', pubkey: '', address: '', balance: {confirmed: '', unconfirmed: ''}, transactions: [{pubkey: '', address: ''} ... ], utxos: {...}}

    return [
      {
        /*  type: 'receive', // 'receive' / 'change'
         pubkey: '',
         address: '', */
        balance: {
          confirmed: 0,
          unconfirmed: 0
        },
        transactions: [
          {
            pubkey: 'string',
            address: 'string',
            txid: 'string'
          },
          {
            pubkey: 'string',
            address: 'string',
            txid: 'string'
          }
        ],
        utxos: [
          {
            txid: 'string',
            vout: 0
          }
        ]
      }
    ]
  }

  @post('walletInfo/{descriptor}', {
    security: SECURITY_SPEC,
    summary: 'Get wallet information by descriptor',
    responses: {
      '200': Object // WalletInfoByDescriptorResponse
    },
  })

  // @authenticate('jwt')
  /* @authorize({
        allowedRoles: ['admin'],
        voters: [basicAuthorization],
      }) */
  async getWalletInfo(
    @requestBody(ReqDescriptor) ReqDescriptor: MDescriptor,
  ): Promise<any> { // Promise<Array<WalletResponse>>?
    console.log("descriptorRequest", ReqDescriptor)


    // let allAdresses = {pubkey: {}, address: {receive: [], change: []}, balance: {confirmed: 0, unconfirmed: 0}, transactions: [{}], utxos: [{}]}
    // const addreses = POST addresses/{descriptor}
    // addreses.map(address => {
    // const addressData = POST addressInfo/{address}
    // allAdresses['pubkey'].push(address.pubkey)
    // allAdresses['address'][address.type].push(address.address)
    // allAdresses['balance']['confirmed'] += address.balance.confirmed
    // allAdresses['balance']['unconfirmed'] += address.balance.unconfirmed
    // address.transactions.map(tx => {
    //   allAdresses['transactions'].push(tx)
    // })
    // address.utxos.map(utxo => {
    //   allAdresses['utxos'].push(utxos)
    // })
    // })
    // return allAdresses


    return true;
  }
}
