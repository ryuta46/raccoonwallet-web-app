
export class InvoiceData {
  public readonly address: string;
  public readonly amount: number;
  public readonly message: string;
  constructor(addr: string, amount: number = 0, message: string = "") {
    this.address = addr.split('-').join('');
    this.amount = amount;
    this.message = message;
  }

  static fromJsonString(jsonString: string): InvoiceData | null {
    try {
      const json = JSON.parse(jsonString)
      if (json.v != 2 || json.type != 2) {
        return null;
      }
      const address = json.data.addr;
      if (!address || address.length === 0) {
        return null
      }
      const amount = json.data.amount || 0;
      const message =  json.data.message || "";

      return new InvoiceData(address, amount, message);
    } catch (e) {
      return null;
    }


  }

  toJsonString() : string {
    const json = {
      v: 2,
      type: 2,
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
