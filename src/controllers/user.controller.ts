import {
  authenticate,
  TokenService,
  UserService
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  RestBindings
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {basicAuthorization} from '../middlewares/auth.midd';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasher} from '../services';
import {SECURITY_SPEC} from '../utils/security-spec';
import {
  ChangeRole,
  ChangeRoleRequestBody,
  CredentialsRequestBody,
  UserProfileResponse
} from './specs/user-controller.specs';
const jwt = require('jsonwebtoken');
const verifyAsync = promisify(jwt.verify);

export class UserController {
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

  @post('/users/register', {
    summary: 'Register a user',
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody(CredentialsRequestBody) newUserRequest: Credentials,
  ): Promise<User> {
    // find 3 users orderBy email ASC with userCredentials data
    // https://loopback.io/doc/en/lb4/Working-with-data.html
    /* const users = await this.userRepository.find({
      order: ['email ASC'],
      limit: 3,
      include: ['userCredentials']
    });
    console.log('users', users); */

    newUserRequest.role = 'user';
    return this.userRepository.createUser(newUserRequest);
  }

  @get('/users/{userId}', {
    security: SECURITY_SPEC,
    summary: 'Get users data by userId',
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  @get('/users/me', {
    security: SECURITY_SPEC,
    summary: 'Get logged user data',
    responses: {
      '200': UserProfileResponse,
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId);
  }

  @post('/users/login', {
    summary: 'Login a user',
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/users/changeRole', {
    summary: 'Change users role',
    security: SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async changeRole(
    @requestBody(ChangeRoleRequestBody) changeRole: ChangeRole,
  ): Promise<{success: boolean}> {
    const roles = ['admin', 'member', 'user'];
    let user;
    // console.log("resp", changeRole)

    if (!roles.includes(changeRole.newRole)) {
      throw new HttpErrors.Unauthorized('Role is not correct.');
    }

    try {
      user = await this.userRepository.findById(changeRole.userId);
    } catch (e: any) {
      if (e.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.Unauthorized('Incorrect userId.');
      }
      throw new Error(e);
    }

    if (
      user.email === process.env.ADMIN_EMAIL ||
      user.email === process.env.ADMIN_EMAIL
    ) {
      throw new HttpErrors.Unauthorized('Inmutable userId.');
    }

    const token = this.req.headers['authorization']!.replace('Bearer ', '');
    const decodedToken = await verifyAsync(
      token,
      process.env.JWT_ACCESS_SECRET,
    );
    const userData = await this.userRepository.findOne({
      where: {id: decodedToken.id},
    });

    // admin change role to other admin as long as it is not the admin user itself
    if (user.role === 'admin' && user.id !== userData!.id) {
      throw new HttpErrors[403]();
    }

    await this.userRepository.updateById(changeRole.userId, {
      role: changeRole.newRole,
    });

    return {success: true};
  }
}
