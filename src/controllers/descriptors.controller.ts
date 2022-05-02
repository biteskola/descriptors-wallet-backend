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

@model()
export class Address {
  @property({
    type: 'string',
    required: true,
  })
  address: string;
}

export const AddressRequestBody = {
  description: 'The input for addresss',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Address),
    },
  },
};

@model()
export class Descriptor {
  @property({
    type: 'string',
    required: true,
  })
  descriptors: string;
}

export const DescriptorRequestBody = {
  description: 'The input for descriptors',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Descriptor),
    },
  },
};

@model()
export class AddressResponse {
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

@model()
export class DescriptorByAddressesResponse {
  @property({
    type: 'array',
    required: true,
    itemType: AddressResponse,
  })
  data: Array<AddressResponse>;
}

export const DescriptorByAddressesResponseBody = {
  description: 'Response data',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(DescriptorByAddressesResponse),
    },
  },
};

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
      '200': DescriptorByAddressesResponseBody
    },
  })

  // @authenticate('jwt')
  /* @authorize({
        allowedRoles: ['admin'],
        voters: [basicAuthorization],
      }) */
  async getAddressesByDescriptor(
    @requestBody(DescriptorRequestBody) descriptorRequest: Descriptor,
  ): Promise<Array<AddressResponse>> {
    console.log("descriptorRequest", descriptorRequest)

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
    @requestBody(AddressRequestBody) addressRequest: Address,
  ): Promise<any> { // Promise<Array<WalletResponse>>
    console.log("addressRequest", addressRequest)

    // ElectrumClient.blockchainScripthash_getbalance(address)
    // ElectrumClient.blockchainScripthash_gethistory(address)
    // ElectrumClient.blockchainScripthash_listunspent(address)
    // RESPONSE: [{type: 'receive' / 'change', pubkey: '', address: '', balance: {confirmed: '', unconfirmed: ''}, transactions: [{pubkey: '', address: ''} ... ], utxos: {...}}

    return true;
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
    @requestBody(DescriptorRequestBody) descriptorRequest: Descriptor,
  ): Promise<any> { // // Promise<Array<WalletResponse>>?
    console.log("descriptorRequest", descriptorRequest)


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
