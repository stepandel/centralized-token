export type AddAccountRequest = {
  account: UserAccount;
}

export type AddAccountResponse = {
  accountId: string;
}

export type UserAccount = {
  userEmail: string;
  status: "active" | "locked";
  createdAt: string;
  updatedAt: string;
}

export type AccountTableEntry = {
  _id: any,
  userEmail: string;
  status: "active" | "locked";
  createdAt: string;
  updatedAt: string;
}

export type GetAccountRequest = {
  userEmail: string,
}

export type GetAccountResponse = {
  account: UserAccount,
}