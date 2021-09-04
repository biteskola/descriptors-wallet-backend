import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {MongoDataSource} from '../datasources';
import {PasswordHasherBindings} from '../keys';
import {User, UserCredentials, UserRelations} from '../models';
import {PasswordHasher, validateCredentials} from '../services';
import {UserCredentialsRepository} from './user-credentials.repository';

export type Credentials = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err: any) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }

  public async createUser(credentials: Credentials) {
    // ensure a valid email value and password value
    validateCredentials(_.pick(credentials, ['email', 'password']));

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      credentials.password,
    );

    try {
      // create the new user
      const savedUser = await this.create(_.omit(credentials, 'password'));

      // set the password
      await this.userCredentials(savedUser.id).create({password});

      return savedUser;
    } catch (err: any) {
      // MongoError 11000 duplicate key
      if (err.code === 11000 && err.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw err;
      }
    }
  }
}
