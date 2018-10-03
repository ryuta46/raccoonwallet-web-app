
export class InvoiceData {
  public readonly address: string;
  public readonly amount: number;
  public readonly message: string;
  public readonly type: number;
  constructor(addr: string, amount: number = 0, message: string = "", type: number = 2) {
    this.address = addr.split('-').join('');
    this.amount = amount;
    this.message = message;
    this.type = type
  }

  static fromJsonString(jsonString: string): InvoiceData | null {
    try {
      const json = JSON.parse(jsonString);
      const type = json.type;
      if (json.v != 2 || ((type != 1) && (type != 2))) {
        return null;
      }
      const address = json.data.addr;
      if (!address || address.length === 0) {
        return null
      }
      const amount = json.data.amount || 0;
      const message =  json.data.msg || "";

      return new InvoiceData(address, amount, message, type);
    } catch (e) {
      return null;
    }


  }

  toJsonString() : string {
    const json = {
      v: 2,
      type: this.type,
      data: {
        name: "",
        addr: this.address,
        amount: this.amount,
        msg: this.message
      }
    };
    return JSON.stringify(json);
  }


}
