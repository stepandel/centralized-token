import { addUser, getAccountBalance, getUser, isLockedAccount, loadUsers } from "./account_helpers";
import { AddAccountRequest, AddAccountResponse, GetAccountRequest, GetAccountResponse, MakeTransactionRequest, MakeTransactionResponse, Transaction, UserAccount } from "./models";
import { createTransaction, creditOrDebitAccount } from "./transaction_helpers";
import { lambdaWrap } from "./utils";


async function getAccount(r: GetAccountRequest): Promise<GetAccountResponse> {
  return { account: await getUser(r.userEmail) };
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  let userAccount: UserAccount = {
    userEmail: r.userEmail,
    status: r.status,
    createdAt: new Date().toISOString(),
  }

  console.log({userAccount});

  return { accountId: await addUser(userAccount) };
}

async function loadAccounts(accounts: UserAccount[]) {
  return loadUsers(accounts);
}

async function makeTransaction(r: MakeTransactionRequest): Promise<MakeTransactionResponse> {
  // Check if either account is locked
  let isLocked = (await isLockedAccount(r.to_email)) && (await isLockedAccount(r.from_email));

  if (!isLocked) {
    // Subtract from balance if possible
    let creditResult = await creditOrDebitAccount(r.from_email, r.amount, true);
    if (creditResult) {
      // Add to balance
      await creditOrDebitAccount(r.to_email, r.amount, false);
    }
  }

  return { sender_balance: await getAccountBalance(r.from_email), receiver_balance: await getAccountBalance(r.to_email) };

}

// Test function
async function loadTransaction(transaction: Transaction) {
  return createTransaction(transaction);
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
  addAccount: lambdaWrap(addAccount),
  loadAccounts: lambdaWrap(loadAccounts),
  makeTransaction: lambdaWrap(makeTransaction),
  loadTransaction: lambdaWrap(loadTransaction),
}