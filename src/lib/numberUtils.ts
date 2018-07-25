import {Decimal} from 'decimal.js'

export function getDivided(value: number, divisibility: number): Decimal {
  return new Decimal(value).div(10 ** divisibility);
}

export function roundAt(value: number, precision: number): Decimal {
  return new Decimal(value).mul(10 ** precision).round().div(10 ** precision)
}
