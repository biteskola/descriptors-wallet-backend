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
  @property({
    type: 'string',
    required: true,
  })
  pubkey: string;

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
          type: 'object',
          properties: {
            pubkey: {
              type: 'string',
              required: true
            },
            address: {
              type: 'string',
              required: true
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
    @requestBody(ReqDescriptor) ReqDescriptor: MDescriptor,
  ): Promise<Array<ResAddress>> {
    console.log("descriptorRequest", ReqDescriptor)

    // deriveaddress => bitcoin-cli
    // RESPONSE: [ { pubkey: '', address: '' }, { pubkey: '', address: '' } ... }]

    return [
      {
        "pubkey": "string",
        "address": "string"
      },
      {
        "pubkey": "string",
        "address": "string"
      }
    ];
  }

  @post('addressInfo/{address}', {
    security: SECURITY_SPEC,
    summary: 'Get information of an address',
    responses: {
      '200': Object // AddressInfoByAddressResponse
    },
  })

  // @authenticate('jwt')
  /* @authorize({
        allowedRoles: ['admin'],
        voters: [basicAuthorization],
      }) */
  async getAddressesInfo(
    @requestBody(ReqAddress) ReqAddress: MAddress,
  ): Promise<Array<Object>> { // Promise<Array<WalletResponse>>
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
