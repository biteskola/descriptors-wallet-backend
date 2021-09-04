import {
  Client,
  createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {MigrationRepository} from 'loopback4-migration/dist/repositories';
import request from 'supertest';
import {BtcExplorerApplication} from '../..';
import {UserCredentialsRepository, UserRepository} from '../../repositories';

export async function setupApplication(): Promise<AppWithClient> {
  const testPort = 12345;
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    port: testPort,
  });

  const app = new BtcExplorerApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.migrateSchema();
  await app.start();
  createRestAppClient(app);
  const client = request(`http://localhost:${testPort}/`);
  console.log('[test] API for testing ready');
  return {app, client};
}

export async function stopApplication(
  app: BtcExplorerApplication,
): Promise<boolean> {
  await app.stop();

  console.log('[test] APP stopped');
  await deleteAllDocuments(app);

  return true;
}

async function deleteAllDocuments(
  app: BtcExplorerApplication,
): Promise<boolean> {
  try {
    const userRepo = await app.getRepository(UserRepository);
    const userCredentialsRepo = await app.getRepository(
      UserCredentialsRepository,
    );
    const migrationRepo = await app.getRepository(MigrationRepository);

    await userRepo.deleteAll();
    await userCredentialsRepo.deleteAll();
    await migrationRepo.deleteAll();

    return true;
  } catch (e: any) {
    console.log("error", e)
    throw new Error(e);
  }
}

export interface AppWithClient {
  app: BtcExplorerApplication;
  client: Client;
  // client: Client;
}
