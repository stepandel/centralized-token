import { createUser, getAccountBalance, getUser, isLockedAccount, loadUsers, setStatus } from "./account_helpers";
import { AddAccountRequest, AddAccountResponse, GetAccountRequest, GetAccountResponse, MakeTransactionRequest, MakeTransactionResponse, Transaction, UpdateStatusRequest, UserAccount } from "./models";
import { createTransaction, createTransactions, creditOrDebitAccount } from "./transaction_helpers";
import { lambdaWrap } from "./utils";


async function getAccount(r: GetAccountRequest): Promise<GetAccountResponse> {
  return { account: await getUser(r.userEmail) };
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  return { accountId: await createUser(r.userEmail, r.status) };
}

async function updateStatus(r: UpdateStatusRequest): Promise<{}> {
  await setStatus(r.userEmail, r.status);
  return { success: true }
}

async function makeTransaction(r: MakeTransactionRequest): Promise<MakeTransactionResponse> {
  // Check if either account is locked
  let isLocked = (await isLockedAccount(r.to_email)) || (await isLockedAccount(r.from_email));

  console.log({isLocked});

  if (isLocked) {
    throw new Error("Can't perform transaction. One of the accounts is locked");
  }
  
  // Subtract from balance if possible
  let creditResult = await creditOrDebitAccount(r.from_email, r.amount, true);
  if (creditResult) {
    // Add to balance
    await creditOrDebitAccount(r.to_email, r.amount, false);
  }

  return { sender_balance: await getAccountBalance(r.from_email), receiver_balance: await getAccountBalance(r.to_email) };

}

// Test function
async function loadAccounts(accounts: UserAccount[]) {
  return loadUsers(accounts);
}

async function loadTransaction(transaction: Transaction) {
  return createTransaction(transaction);
}

async function loadTransactions(transactions: Transaction[]) {
  return createTransactions(transactions);
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
  addAccount: lambdaWrap(addAccount),
  updateStatus: lambdaWrap(updateStatus),
  makeTransaction: lambdaWrap(makeTransaction),
  loadAccounts: lambdaWrap(loadAccounts),
  loadTransaction: lambdaWrap(loadTransaction),
  loadTransactions: lambdaWrap(loadTransactions),
}