export class AccountUnderfunded extends Error {
  constructor() {
    super("");
    this.name = this.constructor.name;
  }
}
