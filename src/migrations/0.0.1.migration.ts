import {repository} from '@loopback/repository';
import {MigrationScript} from 'loopback4-migration';
import {User} from '../models';
import {UserRepository} from '../repositories';

// @migrationScript()
export class AddUserFullName implements MigrationScript {
  version = '0.0.1';
  scriptName = AddUserFullName.name;
  description = 'add full name to users by combining first and last name';

  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  async up(): Promise<User> {
    const newFirstAdmin = {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASS!,
      firstName: 'first',
      lastName: 'admin',
      role: 'firstAdmin',
    };

    console.log(`First root (${newFirstAdmin.email}) has been registered.\n`);
    return this.userRepository.createUser(newFirstAdmin);
  }

  // when version download happens
  async down(): Promise<void> { }
}
