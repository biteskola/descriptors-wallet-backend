import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {setupApplication, stopApplication} from '../../../../../dist/__tests__/acceptance/test-helper';

describe('POST /bitcoin', () => {
  let app: RestApplication;
  let client: Client;
  const randomNum = Math.floor(Math.random() * 10000000000 + 1);
  const url = '/bitcoin';
  const user = {
    email: `a@user${randomNum}.com`,
    password: 'passpass',
  };
  const admin = {
    email: `a@admin${randomNum}.com`,
    password: 'passpass',
  };
  const callGetblockcount = {
    "method": "getblockcount",
    "params": []
  }
  const callGetblockhash = {
    "method": "getblockhash",
    "params": [0]
  }

  let userAccessToken: string;
  let firstAdminAccessToken: string;
  let userId: number;

  before('setupApplication', async () => {
    // @ts-ignore
    ({app, client} = await setupApplication());
    const firstAdmin = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASS,
    };

    const registeredUser = await client
      .post('/users/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200);

    const loggedUser = await client
      .post('/users/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200);

    const adminUser = await client
      .post('/users/login')
      .send(firstAdmin)
      .set('Accept', 'application/json')
      .expect(200);

    userAccessToken = loggedUser.body.token;
    userId = registeredUser.body.id;
    firstAdminAccessToken = adminUser.body.token;
  });

  after(async () => {
    // @ts-ignore
    await stopApplication(app);
  });

  it('Invokes getblockcount successfully (from firstAdmin)', async () => {
    const response = await client
      .post(url)
      .send(callGetblockcount)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${firstAdminAccessToken}`)
      .expect(200);

    expect(response.body.result).greaterThanOrEqual(0);
  })

  it('Invokes getblockcount successfully (from admin)', async () => {
    await client
      .post('/users/register')
      .send(admin)
      .set('Accept', 'application/json')
      .expect(200);

    const changeRoleRequest = {
      userId,
      newRole: 'admin',
    };

    await client
      .post('/users/changeRole')
      .send(changeRoleRequest)
      .set('Authorization', `Bearer ${firstAdminAccessToken}`)
      .set('Accept', 'application/json')
      .expect(200);

    const loggedAdmin = await client
      .post('/users/login')
      .send(admin)
      .set('Accept', 'application/json')
      .expect(200);

    const response = await client
      .post(url)
      .send(callGetblockcount)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${loggedAdmin.body.token}`)
      .expect(200);

    expect(response.body.result).greaterThanOrEqual(0);
  })

  it('Invokes getblockcount successfully (from user)', async () => {
    const response = await client
      .post(url)
      .send(callGetblockcount)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200);

    expect(response.body.result).greaterThanOrEqual(0);
  });


  it('Invokes getblockhash successfully (from user)', async () => {
    const response = await client
      .post(url)
      .send(callGetblockhash)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200);

    expect(response.body).ownProperty('result');
    expect(response.body.error).equal(null);
  });

  it('Invokes getblock successfully (from user)', async () => {
    const response = await client
      .post(url)
      .send(callGetblockhash)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200);

    const blockHash = response.body.result;

    const response2 = await client
      .post(url)
      .send({
        "method": "getblock",
        "params": [blockHash]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .expect(200);

    expect(response2.body.result.hash).equal(blockHash);
  });
});

