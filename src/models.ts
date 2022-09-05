import { ObjectId } from "mongodb";

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
  _id: any;
  userEmail: string;
  status: "active" | "locked";
  createdAt: string;
  updatedAt: string;
  balance: number;
}

export type GetAccountRequest = {
  userEmail: string;
}

export type GetAccountResponse = {
  account: UserAccount;
}

export type TransactionTableEntry = {
  _id: ObjectId;
  userEmail: string;
  amount: number;
  type: "receive" | "send";
  createdAt: string;
}

export type MakeTransactionRequest = {
  from_email: string;
  to_email: string;
  amount: number;
}

export type MakeTransactionResponse = {
  sender_balance: number;
  receiver_balance: number;
}

export type Transaction = {
  userEmail: string,
  amount: number,
  type: "receive" | "send",
  createdAt: string,
}