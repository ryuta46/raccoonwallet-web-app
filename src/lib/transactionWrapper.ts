import {
  Address, Message,
  Mosaic,
  MultisigTransaction, PublicAccount,
  TimeWindow,
  Transaction,
  TransactionTypes,
  TransferTransaction
} from 'nem-library';
import {DateTimeFormatter} from 'js-joda';
import Decimal from 'decimal.js';
import {getDivided} from "./numberUtils";

export class TransactionWrapper {
  readonly transaction: Transaction;
  readonly transferTransaction: TransferTransaction;
  readonly dateString: string;
  readonly timeString: string;
  readonly isReception: boolean;
  readonly isMultisig: boolean;

  get isConfirmed(): boolean {
    return this.transaction.isConfirmed();
  }

  get xemAmount(): Decimal {
    if (this.transferTransaction.containsMosaics()) {
      return new Decimal(0);
    } else {
      if (this.isConfirmed) {
        return getDivided(this.transferTransaction.xem().quantity(), 6);
      } else {
        // Quantity of unconfirmed transaction is incorrect.
        return getDivided(this.transferTransaction.xem().amount, 6);
      }

    }
  }

  get mosaics(): Mosaic[] {
    if (this.transferTransaction.containsMosaics()) {
      return this.transferTransaction.mosaics();
    } else {
      return [];
    }
  }

  get timeWindow(): TimeWindow {
    return this.transaction.timeWindow;
  }
  get message(): Message {
    return this.transferTransaction.message;
  }

  get senderAddress(): string {
    if (this.transaction.signer) {
      return this.transaction.signer.address.pretty();
    } else {
      return '';
    }
  }

  get senderPublic(): PublicAccount | null {
    if (this.transaction.signer) {
      return this.transaction.signer;
    } else {
      return null;
    }
  }

  get receiverAddress(): string {
    return this.transferTransaction.recipient.pretty();
  }

  get peer(): string {
    if (this.isReception) {
      return this.senderAddress;
    } else {
      return this.receiverAddress;
    }
  }

  get feeAmount(): Decimal {
    return getDivided(this.transaction.fee, 6);
  }

  private constructor(transaction: Transaction, transferTransaction: TransferTransaction, isReception: boolean, isMultisig: boolean) {
    this.transaction = transaction;
    this.transferTransaction = transferTransaction;


    const dateFormatter = DateTimeFormatter.ofPattern('MM/dd yyyy');
    const timeFormatter = DateTimeFormatter.ofPattern('HH:mm:ss');

    this.dateString = this.timeWindow.timeStamp.format(dateFormatter);
    this.timeString = this.timeWindow.timeStamp.format(timeFormatter);
    this.isReception = isReception;
    this.isMultisig = isMultisig;
  }

  static fromTransferTransaction(transaction: TransferTransaction, accountAddress: Address): TransactionWrapper {
    const isReception = (transaction.recipient.plain() === accountAddress.plain());
    return new TransactionWrapper(transaction, transaction, isReception, false);
  }
  static fromMultisigTransaction(transaction: MultisigTransaction, accountAddress: Address): TransactionWrapper | null {
    if (transaction.otherTransaction.type != TransactionTypes.TRANSFER) {
      return null;
    }
    const transferTransaction = transaction.otherTransaction as TransferTransaction;

    const isReception = (transferTransaction.recipient.plain() === accountAddress.plain());
    return new TransactionWrapper(transaction, transferTransaction, isReception, true);
  }

  static fromTransaction(transaction: Transaction, accountAddress: Address): TransactionWrapper | null{
    if (transaction.type == TransactionTypes.TRANSFER) {
      return this.fromTransferTransaction(transaction as TransferTransaction, accountAddress);
    }
    if (transaction.type == TransactionTypes.MULTISIG) {
      return this.fromMultisigTransaction(transaction as MultisigTransaction, accountAddress);
    }
    return null;
  }
}
