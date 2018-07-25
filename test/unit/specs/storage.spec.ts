import {
  Storage,
  PinCodeHelper,
  Wallet
} from "../../../src/lib/storage";

class LocalStorageMock {
  store: any = {};

  clear() {
    this.store = {};
  }
  // noinspection JSUnusedGlobalSymbols
  getItem(key: string) {
    return this.store[key] || null;
  }

  // noinspection JSUnusedGlobalSymbols
  setItem(key: string, value: any) {
    this.store[key] = value.toString();
  }

  // noinspection JSUnusedGlobalSymbols
  removeItem(key: string) {
    delete this.store[key];
  }
}

/*
describe('storage', () => {
  const testAccount = new Wallet();

  beforeEach( function(this: any) {
    Object.defineProperty(window, 'localStorage', {
      value: new LocalStorageMock()
    });

    testAccount.address = 'TEST_ACCOUNT';
    testAccount.name = 'TEST_NAME';
    testAccount.secret = 'TEST_SECRET';

  });

  it('should be empty first', () => {
    expect(StorageAccessor.getWallets().length).toBe(0)
  });

  it('has saved data', function(this: any) {
    StorageAccessor.addRawWallet(testAccount);

    expect(StorageAccessor.getWallets().length).toBe(1);

    const resultAccount = StorageAccessor.getWallets()[0];

    expect(resultAccount.name).toBe(testAccount.name);
    expect(resultAccount.address).toBe(testAccount.address);
    expect(resultAccount.secret).toBe(testAccount.secret);
  });

  it('has no data after clear', () => {
    StorageAccessor.addRawWallet(testAccount);

    StorageAccessor.clear();

    expect(StorageAccessor.getWallets().length).toBe(0);
  });
});
*/
/*

describe('pin', () => {
  const testPin = '783019';

  beforeEach( function(this: any) {
    Storage.setup();
  });

  it('should be empty first', () => {
    Object.defineProperty(window, 'localStorage', {
      value: new LocalStorageMock()
    });

    PinCodeHelper.hasSavedCode().then(result => expect(result).toBe(false));
  });

  it('has saved data', function(this: any) {

    PinCodeHelper.

    expect(StorageAccessor.getWallets().length).toBe(1);

    const resultAccount = StorageAccessor.getWallets()[0];

    expect(resultAccount.name).toBe(testAccount.name);
    expect(resultAccount.address).toBe(testAccount.address);
    expect(resultAccount.secret).toBe(testAccount.secret);
  });

  it('has no data after clear', () => {
    StorageAccessor.addRawWallet(testAccount);

    StorageAccessor.clear();

    expect(StorageAccessor.getWallets().length).toBe(0);
  });
});

*/
