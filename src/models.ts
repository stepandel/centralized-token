export type AddAccountRequest = {
  account: UserAccount;
}

export type AddAccountResponse = {
  accountId: string;
}

type UserAccount = {
  userEmail: string;
  status: "active" | "locked";
  createdAt: string;
  updatedAt: string;
}