import {Entity, model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';

const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

export const UserProfileResponse = {
  description: 'The current user profile',
  content: {
    'application/json': {
      schema: UserProfileSchema,
    },
  },
};

/* @model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
} */

@model()
export class ChangeRole extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    required: true,
    type: 'string',
  })
  newRole: string;
}

@model()
class Credentials extends Entity {
  @property({
    type: 'string',
    format: 'email',
    required: true,
  })
  email: string;

  @property({
    required: true,
    type: 'string',
    minLength: 8,
  })
  password: string;
}

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Credentials),
    },
  },
};



export const ChangeRoleRequestBody = {
  description: 'The input for change role',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(ChangeRole),
    },
  },
};
