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
  sleep,
} from 'lamington';
import * as chai from 'chai';
import * as openpgp from 'openpgp';

import { Infiniteshop, InfiniteshopUserTable } from './infiniteshop';
import { EosioToken } from '../eosio.token/eosio.token';
import { TokenSymbol } from '../../scripts/helpers';
import {
  categories,
  categoryBigInt,
  categoryHex,
} from '../../scripts/categories';
// import { sleep } from 'lamington';

const token_contract = 'token.savact';
const token_symbol: TokenSymbol = { name: 'SAVACT', precision: 4 };

let shopContract: Infiniteshop;
let myToken: EosioToken;

let sender1: Account;
let sender2: Account;
let sender3: Account;

describe('shop', async () => {
  before(async () => {
    await seedAccounts();
  });

  // Add shop
  context('Add shop (a/3)', async () => {
    let pgpKey: string;
    before(async () => {
      pgpKey =
        '-----BEGIN PUBLIC KEY-----\nabcdefghijklmnop\n-----END PUBLIC KEY-----';
    });
    context('with wrong auth', async () => {
      it('should fail a1', async () => {
        await assertMissingAuthority(
          shopContract.updateuser(
            sender1.name,
            ['user1@ininite.shop', 't.me/infiniteshop'],
            [
              { sym: '4,EOS', contr: 'eosio.token', chain: 'eos' },
              { sym: '4,ZEOS', contr: 'thezeostoken', chain: 'eos' },
            ],
            true,
            pgpKey,
            'I like to sell a lot',
            { from: sender2 }
          )
        );
      });
    });
    context('with correct auth', async () => {
      it('should succeed a2', async () => {
        await shopContract.updateuser(
          sender1.name,
          ['user1@ininite.shop', 't.me/infiniteshop'],
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
      it('should update users table a3', async () => {
        const { rows } = await shopContract.userTable();
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const seller = rows[0];
        chai.expect(seller.user).equal(sender1.name, 'Wrong seller name');

        // Check contact
        chai.expect(seller.contact.length).equal(2, 'Wrong contact amount');
        chai.expect(seller.contact[0]).equal('user1@ininite.shop');
        chai.expect(seller.contact[1]).equal('t.me/infiniteshop');

        chai.expect(seller.active).equal(true, 'Wrong active state');
        chai.expect(seller.banned).equal(false, 'Wrong banned state');
        chai.expect(seller.items.length).equal(0, 'Wrong item count');
        chai
          .expect(seller.lastUpdate)
          .below(Math.floor(Date.now() / 1000) + 1, 'Wrong last update');
        chai
          .expect(seller.lastUpdate)
          .greaterThan(Math.floor(Date.now() / 1000) - 60, 'Wrong last update');
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
    });
  });
  // Add item
  context('Add item (b/13)', async () => {
    let expirationDate: number;
    let category: bigint;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      category = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"
    });
    context('with correct auth', async () => {
      it('should succeed b1', async () => {
        await shopContract.additem(
          sender1.name,
          category,
          'Arduino Mega 2560',
          [
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'https://cdn.quasar.dev/img/parallax2.jpg',
          ],
          [
            { p: 123, pcs: 1 },
            { p: 200, pcs: 2 },
          ],

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
      it('should update items table b2', async () => {
        const { rows } = await shopContract.itemTable({
          scope: categoryBigInt(2, 1).toString(),
        });
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
        chai.expect(item.pp[0].p).equal(123, 'Wrong price');
        chai.expect(item.pp[0].pcs).equal(1, 'Wrong pieces');
        chai.expect(item.pp[1].p).equal(200, 'Wrong price');
        chai.expect(item.pp[1].pcs).equal(2, 'Wrong pieces');
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
      it('wrong auth b3', async () => {
        await assertMissingAuthority(
          shopContract.additem(
            sender2.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 123, pcs: 1 }],

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
      it('no price b4', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [],
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
          'No prices defined'
        );
      });
      it('no price b5', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 0, pcs: 1 }],
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
      it('no price b6', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 1, pcs: 0 }],
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
          'Pieces cannot be zero'
        );
      });
      it('too early expiration date b7', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],
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
      it('too late expiration date b8', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],

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
      it('too long title b9', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],

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
      it('too short title b10', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'A',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],

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
      it('invalid ship region b11', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],
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
      it('invalid option b12', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],
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
      it('only one option b13', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.additem(
            sender1.name,
            category,
            'Arduino Uno',
            ['https://cdn.quasar.dev/img/parallax1.jpg'],
            [{ p: 2, pcs: 1 }],
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
  // Remove an item
  context('Remove item (c/4)', async () => {
    let category: bigint;
    before(async () => {
      category = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"
    });
    context('with correct auth', async () => {
      it('should fail with not existing id c1', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.removeitem(1, category, { from: sender1 }),
          'Item not found'
        );
      });
      it('should fail to remove by anyone if it is still not expired c2', async () => {
        await assertEOSErrorIncludesMessage(
          shopContract.removeitem(0, category, { from: sender2 }),
          'Is not expired yet'
        );
      });
      it('should succeed c3', async () => {
        await shopContract.removeitem(0, category, { from: sender1 });
      });
      it('should update items table c4', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(0, 'Wrong amount of entries');
      });
    });
  });
  // Update a seller
  context('Update seller (d/4)', async () => {
    let expirationDate: number;
    let pgpKey: string;
    let newPgpKey: string;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      pgpKey =
        '-----BEGIN PUBLIC KEY-----\nabcdefghijklmnop\n-----END PUBLIC KEY-----';
      newPgpKey =
        '-----BEGIN PUBLIC KEY-----\nhijklmnop\n-----END PUBLIC KEY-----';
    });
    context('prepare', async () => {
      it('should succeed to add another user d1', async () => {
        await shopContract.updateuser(
          sender2.name,
          ['user2@ininite.shop', 't.me/infiniteshop2'],
          [
            { sym: '4,EOS', contr: 'eosio.token', chain: 'eos' },
            { sym: '4,ZEOS', contr: 'thezeostoken', chain: 'eos' },
          ],
          true,
          pgpKey,
          'I like to sell a lot',
          { from: sender2 }
        );
      });
    });
    context('with wrong auth', async () => {
      it('should fail d2', async () => {
        await assertMissingAuthority(
          shopContract.updateuser(
            sender2.name,
            ['user2@ininite.shop', 't.me/infiniteseller'],
            [{ sym: '4,EOS', contr: 'eosio.token', chain: 'eos' }],
            false,
            newPgpKey,
            'I do not like to sell',
            { from: sender1 }
          )
        );
      });
    });
    context('with correct auth', async () => {
      it('should succeed d3', async () => {
        await shopContract.updateuser(
          sender2.name,
          ['user2@ininite.shop', 't.me/infiniteseller'],
          [{ sym: '4,EOS', contr: 'eosio.token', chain: 'eos' }],
          false,
          newPgpKey,
          'I do not like to sell',
          { from: sender2 }
        );
      });

      it('should update users table d4', async () => {
        const { rows } = await shopContract.userTable();

        // Find seller entry
        let seller: InfiniteshopUserTable | undefined = undefined;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].user == sender2.name) {
            seller = rows[i];
            break;
          }
        }
        chai.expect(seller === undefined).equal(false, 'Seller not found');
        if (seller === undefined) return;

        // Check contact
        chai.expect(seller.contact.length).equal(2, 'Wrong contact amount');
        chai.expect(seller.contact[0]).equal('user2@ininite.shop');
        chai.expect(seller.contact[1]).equal('t.me/infiniteseller');

        chai.expect(seller.active).equal(false, 'Wrong active state');
        chai.expect(seller.banned).equal(false, 'Wrong banned state');
        chai.expect(seller.items.length).equal(0, 'Wrong item count');

        // Check last update
        chai
          .expect(seller.lastUpdate)
          .below(Math.floor(Date.now() / 1000) + 1, 'Wrong last update');
        chai
          .expect(seller.lastUpdate)
          .greaterThan(Math.floor(Date.now() / 1000) - 60, 'Wrong last update');

        // Check allowed token
        chai.expect(seller.allowed.length).equal(1, 'Wrong token number');
        chai.expect(seller.allowed[0].sym).equal('4,EOS', 'Wrong token symbol');
        chai
          .expect(seller.allowed[0].contr)
          .equal('eosio.token', 'Wrong token contract');
        chai.expect(seller.allowed[0].chain).equal('eos', 'Wrong token chain');

        chai.expect(seller.pgp).equal(newPgpKey, 'Wrong pgp key');
        chai.expect(seller.note).equal('I do not like to sell', 'Wrong note');
      });
    });
  });
  // Delete a seller
  context('Delete seller (e/6)', async () => {
    let expirationDate: number;
    let category: bigint;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      category = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"
    });
    context('prepare', async () => {
      it('should succeed to add an item e1', async () => {
        await shopContract.additem(
          sender2.name,
          category,
          'Arduino Uno',
          ['https://cdn.quasar.dev/img/parallax1.jpg'],
          [{ p: 123, pcs: 1 }],
          3 * 24 * 3600,
          'eu',
          'de',
          [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
          ['Green', 'Blue', 'Red'],
          'Cool arduino for your projects',
          'I send without tracking',
          true,
          expirationDate,
          { from: sender2 }
        );
      });
      it('should update items table e2', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
      });
    });
    context('with wrong auth', async () => {
      it('should fail e3', async () => {
        await assertMissingAuthority(
          shopContract.deleteuser(sender2.name, { from: sender1 })
        );
      });
    });
    context('with correct auth', async () => {
      it('should succeed e4', async () => {
        await shopContract.deleteuser(sender2.name, { from: sender2 });
      });
      it('should update users table e5', async () => {
        const { rows } = await shopContract.userTable();
        chai.expect(rows.length).equal(1, 'Wrong amount of entries left');
        const seller = rows[0];
        chai.expect(seller.user).equal(sender1.name, 'Wrong seller name left');
      });
      it('should delete entry of this user also on items table e6', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(0, 'Wrong amount of entries');
      });
    });
  });
  // Change item state
  context('Change item state (f/5)', async () => {
    let expirationDate: number;
    let newExpirationDate: number;
    let category: bigint;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600 - 10;
      newExpirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      category = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"
    });
    context('prepare', async () => {
      it('should succeed to add an item f1', async () => {
        await shopContract.additem(
          sender1.name,
          category,
          'Arduino Uno',
          ['https://cdn.quasar.dev/img/parallax1.jpg'],
          [{ p: 123, pcs: 1 }],
          3 * 24 * 3600,
          'eu',
          'de',
          [{ t: 4 * 24 * 3600, p: 140, rs: 'nl' }],
          ['Green', 'Blue', 'Red'],
          'Cool arduino for your projects',
          'I send without tracking',
          true,
          expirationDate,
          { from: sender1 }
        );
      });
      it('should update items table f2', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
      });
    });
    context('with wrong auth', async () => {
      it('should fail f3', async () => {
        await assertMissingAuthority(
          shopContract.itemstate(0, category, false, newExpirationDate, {
            from: sender2,
          })
        );
      });
    });
    context('with correct auth', async () => {
      it('should succeed f4', async () => {
        await shopContract.itemstate(0, category, false, newExpirationDate, {
          from: sender1,
        });
      });
      it('should update items table f5', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const item = rows[0];
        chai.expect(item.available).equal(false, 'Wrong available state');
        chai
          .expect(item.expired)
          .equal(newExpirationDate, 'Wrong expiration date');
      });
    });
  });
  // Ban a seller
  context('Ban a seller (g/4)', async () => {
    context('with wrong auth', async () => {
      it('of other user should fail g1', async () => {
        await assertMissingAuthority(
          shopContract.ban(sender1.name, true, { from: sender2 })
        );
      });
      it('of same user should fail g2', async () => {
        await assertMissingAuthority(
          shopContract.ban(sender1.name, true, { from: sender1 })
        );
      });
    });
    context('with correct auth', async () => {
      it('of contract account should succeed g3', async () => {
        await shopContract.ban(sender1.name, true, {
          from: shopContract.account,
        });
      });
      it('should update users table g4', async () => {
        const { rows } = await shopContract.userTable();
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const seller = rows[0];
        chai.expect(seller.banned).equal(true, 'Wrong banned state');
      });
    });
  });
  // Unban a seller
  context('Unban a seller (h/4)', async () => {
    context('with wrong auth', async () => {
      it('of other user should fail h1', async () => {
        await assertMissingAuthority(
          shopContract.ban(sender1.name, false, { from: sender2 })
        );
      });
      it('of same user should fail h2', async () => {
        await assertMissingAuthority(
          shopContract.ban(sender1.name, false, { from: sender1 })
        );
      });
    });
    context('with correct auth', async () => {
      it('of contract account should succeed h3', async () => {
        await shopContract.ban(sender1.name, false, {
          from: shopContract.account,
        });
      });
      it('should update users table h4', async () => {
        const { rows } = await shopContract.userTable();
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
        const seller = rows[0];
        chai.expect(seller.banned).equal(false, 'Wrong banned state');
      });
    });
  });
  // Remove expired items
  context('Remove expired items (i/2)', async () => {
    context('with no change', async () => {
      let category: bigint;
      before(async () => {
        category = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"
      });
      it('should succeed in any case i1', async () => {
        await shopContract.rmexpired(category, { from: sender3 });
      });
      it('should not update items table i1', async () => {
        const { rows } = await shopContract.itemTable({
          scope: category.toString(),
        });
        chai.expect(rows.length).equal(1, 'Wrong amount of entries');
      });
    });
  });
  // Further item uploads for testing the interface
  context('Further uploads (j/5)', async () => {
    let expirationDate: number;
    let pgpKey: string;
    let category1: bigint, category2: bigint;
    before(async () => {
      expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
      pgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZuRcghYJKwYBBAHaRw8BAQdAbag0y5jbyY/MsAg7RL7w0Lrb2GsoLNe4
nEwCKwi4naLNAMKMBBAWCgA+BYJm5FyCBAsJBwgJkOMS/IOFejPKAxUICgQW
AAIBAhkBApsDAh4BFiEEW6NFYmQBue+caIkK4xL8g4V6M8oAAAmIAP9fa7l5
Cam5t6LWVR8D8zTiiZNuzvh++AQPpdPggAdVYAEA8kVY6TJV/X8HnbHIGaij
cL9rEzLJRNSdXfRB4jLBsg7OOARm5FyCEgorBgEEAZdVAQUBAQdAUQfI+MTe
l/gpnNDcj2oG0hVXYMBCE3xaAao95nBqsw4DAQgHwngEGBYKACoFgmbkXIIJ
kOMS/IOFejPKApsMFiEEW6NFYmQBue+caIkK4xL8g4V6M8oAAOc0AQCENmBE
GOWC8F+gEUVK8omWXy3gPeg7SiDusVH6b7l5AAD+LhFsvpeueWCZAy+iAjEY
cIKk7jlu0eaWpGiZ5Yz36AA=
=/FM8
-----END PGP PUBLIC KEY BLOCK-----
`;
      category1 = categoryBigInt(2, 1); // "Electronics"/"Computers, Tablets & Network Hardware"

      category2 = categoryBigInt(11, 1); // "Jewelry & Watches"/"Watches, Parts & Accessories"
    });
    context('verify user.two', async () => {
      // verifiy key
      it('public key j1', async () => {
        await openpgp.readKey({armoredKey: pgpKey});
      });
    });
    context('add a user', async () => {
      it('should succeed j2', async () => {
        await shopContract.updateuser(
          sender3.name,
          ['user3@ininite.shop', 't.me/infiniteshop3'],
          [
            { sym: '4,EOS', contr: 'eosio.token', chain: 'eos' },
            { sym: '4,ZEOS', contr: 'thezeostoken', chain: 'eos' },
          ],
          true,
          pgpKey,
          'I like to sell a lot',
          { from: sender3 }
        );
      });
    });
    context('add more items', async () => {
      it('should succeed in another category j3', async () => {
        await shopContract.additem(
          sender3.name,
          category2,
          'Cheap planet with great landscapes',
          [
            'https://cdn.quasar.dev/img/mountains.jpg',
            'https://cdn.quasar.dev/img/parallax1.jpg',
            'https://cdn.quasar.dev/img/parallax2.jpg',
          ],
          [
            { p: 2, pcs: 0 },
            { p: 123, pcs: 1 },
            { p: 200, pcs: 2 },
          ],
          3 * 24 * 3600,
          'eu',
          '',
          [
            { t: 5 * 24 * 3600, p: 140, rs: 'ww' },
            { t: 4 * 24 * 3600, p: 100, rs: 'de' },
          ],
          [],
          'This is a very good planet',
          'Write me before you send the tokens!',
          true,
          expirationDate,
          { from: sender3 }
        );
      });
      it('should succeed with no image j4', async () => {
        await shopContract.additem(
          sender3.name,
          category2,
          'Watches with Jewelry',
          [],
          [
            { p: 500, pcs: 0 },
            { p: 12300, pcs: 2 },
            { p: 20000, pcs: 3 },
          ],
          3 * 24 * 3600,
          'eu',
          'de',
          [
            { t: 5 * 24 * 3600, p: 140, rs: 'ch' },
            { t: 4 * 24 * 3600, p: 100, rs: 'nl' },
          ],
          ['Gold', 'Silver'],
          'Looks cool',
          'I offer more items on my account page',
          true,
          expirationDate,
          { from: sender3 }
        );
      });
      it('should succeed in another category j5', async () => {
        await shopContract.additem(
          sender3.name,
          category2,
          'Quasar with ionic beams',
          ['https://cdn.quasar.dev/img/quasar.jpg'],
          [
            { p: 0, pcs: 0 },
            { p: 200, pcs: 2 },
          ],
          3 * 24 * 3600,
          'ww',
          'ach',
          [{ t: 5 * 24 * 3600, p: 140, rs: 'ww' }],
          ['big', 'bigger', 'biggest'],
          'This is a very good\nQuasar<br>with long ionic beams',
          'Write me before you send the tokens!',
          true,
          expirationDate,
          { from: sender3 }
        );
      });
    });
  });
});

async function seedAccounts() {
  shopContract = await ContractDeployer.deployWithName<Infiniteshop>(
    'compiled_contracts/infiniteshop/infiniteshop',
    'infiniteshop'
  );
  console.log('shopContract', shopContract.account.name);

  myToken = await ContractDeployer.deployWithName<EosioToken>(
    'compiled_contracts/eosio.token/eosio.token',
    token_contract
  );
  sender1 = await AccountManager.createAccount('user.zero', {
    privateKey: '5KUbBzUD3kDRSQ4riyCNqJePG7kGZqRdQUXN2z8WKaZXMWDTe6e',
  });
  sender2 = await AccountManager.createAccount('user.one', {
    privateKey: '5K4MTxjPbRhDJNsRf5VRmapmrLR67cs1ZpWmsT8vsFMgxA2k59q',
  });
  sender3 = await AccountManager.createAccount('user.two');

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
    'initial balance',
    { from: myToken.account }
  );

  await myToken.transfer(
    myToken.account.name,
    shopContract.account.name,
    transferToken,
    'initial balance',
    { from: myToken.account }
  );
}
function categoriesIndexByBigInt(arg0: any): string | number | bigint {
  throw new Error('Function not implemented.');
}
