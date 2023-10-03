import {
  ContractDeployer,
  assertRowsEqual,
  AccountManager,
  Account,
  assertEOSErrorIncludesMessage,
  assertMissingAuthority,
  EOSManager,
  debugPromise,
  assertRowsEqualStrict,
  assertRowCount,
  assertEOSException,
  assertEOSError,
  UpdateAuth,
  assertRowsContain,
  Asset,
} from 'lamington';
import * as chai from 'chai';

import { Infiniteshop } from './infiniteshop';
import { EosioToken } from '../eosio.token/eosio.token';
import { TokenSymbol } from '../../scripts/helpers';
import { sleep } from 'lamington';

const token_contract = 'token.savact';
const token_symbol: TokenSymbol = { name: 'SAVACT', precision: 4 };

let shopContract: Infiniteshop;
let myToken: EosioToken;

let sender1: Account;
let sender2: Account;

describe('shop', async () => {
  before(async () => {
    await seedAccounts();
  });

  // Add item
  context('Add shop (a/13)', async () => {
    let expirationDate: number;
    let pgpKey: string;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      pgpKey =
        '-----BEGIN PUBLIC KEY-----\nabcdefghijklmnop\n-----END PUBLIC KEY-----';
    });
    context('with correct auth', async () => {
      it('should succeed a1', async () => {
        await shopContract.updateuser(
          sender1.name,
          [
            { sym: '4,EOS', contr: 'eosio.token', chain: 'eos' },
            { sym: '4,ZEOS', contr: 'thezeostoken', chain: 'eos' },
          ],
          true,
          pgpKey,
          'I like to sell a lot',
          { from: sender1 }
        );
      });
      it('should update users table a2', async () => {
        const { rows } = await shopContract.userTable();
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const seller = rows[0];
        chai.expect(seller.user).equal(sender1.name, 'Wrong seller name');
        chai.expect(seller.active).equal(true, 'Wrong active state');
        chai.expect(seller.banned).equal(false, 'Wrong banned state');
        chai.expect(seller.items.length).equal(0, 'Wrong item count');
        chai
          .expect(seller.lastUpdate)
          .below(Math.floor(Date.now() / 1000) + 1, 'Wrong token count');
        chai
          .expect(seller.lastUpdate)
          .greaterThan(Math.floor(Date.now() / 1000) - 60, 'Wrong token count');
        chai.expect(seller.allowed.length).equal(2, 'Wrong token number');

        chai.expect(seller.allowed[0].sym).equal('4,EOS', 'Wrong token symbol');
        chai
          .expect(seller.allowed[1].sym)
          .equal('4,ZEOS', 'Wrong token symbol');
        chai
          .expect(seller.allowed[0].contr)
          .equal('eosio.token', 'Wrong token contract');
        chai
          .expect(seller.allowed[1].contr)
          .equal('thezeostoken', 'Wrong token contract');
        chai.expect(seller.allowed[0].chain).equal('eos', 'Wrong token chain');
        chai.expect(seller.allowed[1].chain).equal('eos', 'Wrong token chain');

        chai.expect(seller.pgp).equal(pgpKey, 'Wrong pgp key');
        chai.expect(seller.note).equal('I like to sell a lot', 'Wrong note');
      });
      it('should succeed a3', async () => {
        await shopContract.additem(
          sender1.name,
          'elektronics',
          'Arduino Mega 2560',
          [
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'https://cdn.quasar.dev/img/parallax2.jpg',
          ],
          123,

          3 * 24 * 3600,
          'eu',
          'de',
          [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
          ['Green', 'Blue', 'Red'],
          'Cool Arduino for your projects',
          'I send without tracking',
          true,
          expirationDate,
          { from: sender1 }
        );
      });
      it('should update items table a4', async () => {
        const { rows } = await shopContract.itemTable({ scope: 'elektronics' });
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const item = rows[0];
        chai.expect(item.id).equal(0, 'Wrong id');
        chai.expect(item.seller).equal(sender1.name, 'Wrong seller name');
        chai.expect(item.available).equal(true, 'Should be available');
        chai.expect(item.title).equal('Arduino Mega 2560', 'Wrong title');
        chai.expect(item.imgs.length).equal(2, 'Wrong image count');
        chai
          .expect(item.imgs[0])
          .equal(
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'Wrong first image'
          );
        chai
          .expect(item.imgs[1])
          .equal(
            'https://cdn.quasar.dev/img/parallax2.jpg',
            'Wrong second image'
          );
        chai.expect(item.price).equal(123, 'Wrong price');
        chai
          .expect(item.expired)
          .equal(expirationDate, 'Wrong expiration date');
        chai.expect(item.fromR).equal('eu', 'Wrong from region');
        chai.expect(item.excl).equal('de', 'Wrong excluded region');
        chai.expect(item.descr).equal('Cool Arduino for your projects');
        chai.expect(item.note).equal('I send without tracking');
        chai.expect(item.prepT).equal(3 * 24 * 3600, 'Wrong preparation time');
      });
    });
    context('should fail with', async () => {
      it('wrong auth a5', async () => {
        await assertMissingAuthority(
          shopContract.additem(
            sender2.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            123,

            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          )
        );
      });
      it('no price a6', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            0,
            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Price cannot be zero'
        );
      });
      it('too early expiration date a7', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,
            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 3600,
            { from: sender1 }
          ),
          'Expiration date is too early'
        );
      });
      it('too late expiration date a8', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,

            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 2 * 365 * 24 * 3600,
            { from: sender1 }
          ),
          'Expiration date is too late'
        );
      });
      it('too long title a9', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,

            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Title is too long'
        );
      });
      it('too short title a10', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'A',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,

            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Title is too short'
        );
      });
      it('invalid ship region a11', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,
            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'n' }],
            ['Green', 'Blue', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Invalid ship region'
        );
      });
      it('invalid option a12', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,
            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green', '', 'Red'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Invalid option'
        );
      });
      it('only one option a13', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            'elektronics',
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            1,
            3 * 24 * 3600,
            'eu',
            'de',
            [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
            ['Green'],
            'Cool arduino for your projects',
            'I send without tracking',
            true,
            Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
            { from: sender1 }
          ),
          'Invalid option number'
        );
      });
    });
  });

  // TODO: Write test for removing a seller
  // TODO: Write test for changing seller state (active/inactive, token)
  // TODO: Write test for removing an item
  // TODO: Write test for changing item state
});

async function seedAccounts() {
  shopContract = await ContractDeployer.deployWithName<Infiniteshop>(
    'contracts/infiniteshop/infiniteshop',
    'infiniteshop'
  );

  myToken = await ContractDeployer.deployWithName<EosioToken>(
    'contracts/eosio.token/eosio.token',
    token_contract
  );
  sender1 = await AccountManager.createAccount('sender1');
  sender2 = await AccountManager.createAccount('sender2');

  await issueTokens();
  await updateAuths();
}

async function updateAuths() {
  await UpdateAuth.execUpdateAuth(
    [{ actor: shopContract.account.name, permission: 'owner' }],
    shopContract.account.name,
    'active',
    'owner',
    UpdateAuth.AuthorityToSet.explicitAuthorities(
      1,
      [
        {
          permission: {
            actor: shopContract.account.name,
            permission: 'eosio.code',
          },
          weight: 1,
        },
      ],
      [{ key: shopContract.account.publicKey!, weight: 1 }]
    )
  );
}

async function issueTokens() {
  try {
    const totalToken = new Asset(
      10000000000000,
      token_symbol.name,
      token_symbol.precision
    );
    await myToken.create(myToken.account.name, totalToken, {
      from: myToken.account,
    });

    const issueToken = new Asset(
      100000000000,
      token_symbol.name,
      token_symbol.precision
    );
    await myToken.issue(myToken.account.name, issueToken, 'initial deposit', {
      from: myToken.account,
    });
  } catch (e) {
    if (
      (e as { json: { error: { what: string } } }).json.error.what !=
      'eosio_assert_message assertion failure'
    ) {
      throw e;
    }
  }

  const transferToken = new Asset(
    10000000000,
    token_symbol.name,
    token_symbol.precision
  );
  await myToken.transfer(
    myToken.account.name,
    sender1.name,
    transferToken,
    'inital balance',
    { from: myToken.account }
  );

  await myToken.transfer(
    myToken.account.name,
    shopContract.account.name,
    transferToken,
    'inital balance',
    { from: myToken.account }
  );
}
