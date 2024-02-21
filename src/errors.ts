export class AccountUnderfunded extends Error {
  constructor() {
    super("");
    this.name = this.constructor.name;
  }
}

export class UnsufficientAllowance extends Error {
  constructor() {
    super("");
    this.name = this.constructor.name;
  }
}

export class CollectionNotSupported extends Error {
  constructor() {
    super("");
    this.name = this.constructor.name;
  }
}
