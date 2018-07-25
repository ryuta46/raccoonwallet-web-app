
import * as CryptoJS from 'crypto-js';
import localForage from 'localforage';


import * as bcrypt from 'bcryptjs'

class PinCode {
  hashedCode = '';
}

export class Wallet {
  id: string = Wallet.createId();
  name: string = "";
  address: string = "";
  publicKey: string = "";
  encryptedSecret: string = "";

  static createWithKeys(name: string, address: string, publicKey: string, secretKey: string, password: string) {
    const wallet = new Wallet();
    wallet.name = name;
    wallet.address = address;
    wallet.publicKey = publicKey;
    wallet.encryptedSecret = encryptString(secretKey, password);
    return wallet;
  }

  static createId(): string {
    return new Date().getTime().toString(16)  + Math.floor(10000 * Math.random()).toString(16);
  }

  decryptSecret(password: string): string | null {
    return decryptString( this.encryptedSecret, password);
  }

  encryptSecret(oldPassword: string, newPassword: string): boolean {
    const rawSecret = this.decryptSecret(oldPassword);
    if (rawSecret) {
      this.encryptedSecret = encryptString(rawSecret, newPassword);
      return true;
    } else {
      return false;
    }

  }
}

class Wallets {
  wallets: Wallet[] = [];
  activeId: string = '';

  get(id: String): Wallet | null {
    const wallet =  this.wallets.find((wallet) => wallet.id === id);
    if (wallet) {
      return wallet;
    } else {
      return null;
    }
  }
  gets(): Wallet[] {
    return this.wallets.slice();
  }

  getActive(): Wallet | null {
    return this.get(this.activeId);
  }

  getIndex(id: string): number {
    for (let index=0; index< this.wallets.length; index++) {
      if (this.wallets[index].id === id) {
        return index;
      }
    }
    return -1;
  }

  getActiveIndex(): number {
    return this.getIndex(this.activeId);
  }

  setActive(id: string) {
    this.activeId = id;
  }

  add(wallet: Wallet){
    this.wallets.push(wallet);
  }

  delete(id: string) {
    const index = this.getIndex(id);
    if (index < 0) {
      return;
    }
    this.wallets.splice(index, 1);

    if (this.activeId === id && this.wallets.length > 0) {
      this.activeId = this.wallets[0].id;
    }
  }

  setName(id: string, name: string) {
    const wallet = this.get(id);
    if (wallet) {
      wallet.name = name;
    }
  }
}


export class Storage {
  private static readonly PIN_CODE_KEY = "PIN_CODE";
  private static readonly WALLETS_KEY = "WALLETS";

  static setup() {
    localForage.config({
      driver      : localForage.INDEXEDDB,
      name        : 'RaccoonWallet',
      version     : 1.0,
      size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName   : 'raccoon_wallet_data', // Should be alphanumeric, with underscores.
      description : 'Preferences of RaccoonWallet'
    });
  }

  static async loadPinCode(): Promise<PinCode | null> {
    const storageObject = await localForage.getItem(this.PIN_CODE_KEY);
    if (storageObject) {
      return Object.assign(new PinCode(), storageObject);
    } else {
      return null;
    }
  }

  static async savePinCode(pinCode: PinCode) {
    await localForage.setItem(this.PIN_CODE_KEY, pinCode);
  }

  static async loadWallets(): Promise<Wallets> {
    const storageObject = await localForage.getItem(this.WALLETS_KEY) || "{}";
    const wallets = Object.assign(new Wallets(), storageObject);
    const newWallets: Wallet[] = [];
    for (let wallet of wallets.wallets) {
       newWallets.push(Object.assign(new Wallet(), wallet));
    }
    wallets.wallets = newWallets;
    return wallets;
  }

  static async saveWallets(wallets: Wallets) {
    await localForage.setItem(this.WALLETS_KEY, wallets);
  }
}


export class PinCodeHelper {
  static readonly defaultPin = "093156";

  static async hasSavedCode(): Promise<boolean> {
    return await Storage.loadPinCode() != null;
  }

  static async update(rawCode: string) {
    const hashedCode = await bcrypt.hash(rawCode, 10);
    const pinCode = new PinCode();
    pinCode.hashedCode = hashedCode;
    await Storage.savePinCode(pinCode);
  }

  static async check(pinCode: string): Promise<boolean> {
    const savedCode = await Storage.loadPinCode();
    if (!savedCode) {
      return false;
    }
    else {
      return await bcrypt.compare(pinCode, savedCode.hashedCode)
    }
  }
}


export class WalletsHelper {
  /**
   * Gets wallet.
   * @param {string} id Wallet ID
   * @returns {Promise<Wallet | null>} Wallet which has the given ID or null if there is no wallet which has the ID.
   */
  static async get(id: string): Promise<Wallet | null> {
    return (await Storage.loadWallets()).get(id);
  }

  /**
   * Gets wallets.
   * @returns {Wallet[]} All wallets.
   */
  static async gets(): Promise<Wallet[]> {
    return (await Storage.loadWallets()).gets();
  }

  /**
   * Gets active wallet.
   * @returns {Wallet | null} Active wallet or null if there is no active wallet.
   */
  static async getActive(): Promise<Wallet | null> {
    return (await Storage.loadWallets()).getActive();
  }

  /**
   * Sets active wallet.
   * @param {string} id Wallet ID.
   */
  static async setActive(id: string) {
    const wallets = await Storage.loadWallets();
    wallets.setActive(id);
    await Storage.saveWallets(wallets);
  }

  /**
   * Adds Wallet.
   * @param {Wallet} wallet New Wallet.
   * @param {boolean} activate If the wallet is activated now or not.
   */
  static async add(wallet: Wallet, activate: boolean = false) {
    const wallets = await Storage.loadWallets();
    wallets.add(wallet);
    if (activate) {
      wallets.setActive(wallet.id);
    }
    await Storage.saveWallets(wallets);
  }

  /**
   * Deletes wallet.
   * @param {string} id Wallet ID
   */
  static async delete(id: string) {
    const wallets = await Storage.loadWallets();
    const wallet = wallets.get(id);
    if (wallet == null) {
      return;
    }
    wallets.delete(id);
    await Storage.saveWallets(wallets);
  }

  static async decryptKey(id: string, password: string): Promise<string | null> {
    const wallet = await this.get(id);
    if (!wallet) {
      return null;
    }
    return wallet.decryptSecret(password);
  }

  static async createWithKeys(name: string, address: string, publicKey: string, secretKey: string, password: string) {
    let wallet: Wallet;
    do {
      wallet = Wallet.createWithKeys(name,address,publicKey, secretKey, password);
    } while((await this.get(wallet.id)) != null);

    return wallet;
  }

  /**
   * Encrypts all registered wallets again.
   * @param {string} oldPassword Current password for encryption.
   * @param {string} newPassword New password for encryption.
   */
  static async encryptWallets(oldPassword: string, newPassword: string): Promise<boolean> {
    const wallets = await Storage.loadWallets();
    for (const wallet of wallets.gets()) {
      if (!wallet.encryptSecret(oldPassword, newPassword)) {
        return false;
      }
    }
    await Storage.saveWallets(wallets);
    return true;
  }

  /**
   * Gets wallet name.
   * @param {string} id Wallet ID.
   * @returns {string} Wallet Name.
   */
  static async getName(id: string): Promise<string> {
    const wallet = await this.get(id);
    if (!wallet) {
      return '';
    }
    return wallet.name;
  }

  /**
   * Sets wallet name.
   * @param {string} id Wallet ID.
   * @param {string} name New wallet ID.
   */
  static async setName(id: string, name: string) {
    const wallets = await Storage.loadWallets();
    wallets.setName(id, name);
    await Storage.saveWallets(wallets);
  }
}


function encryptString(message: string, key: string): string {
  return CryptoJS.AES.encrypt( message, key).toString();
}

function decryptString(encrypted: string, key: string): string | null{
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  try {
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null
  }
}
