import { addUser, getAccountBalance, getUser, isLockedAccount } from "./account_helpers";
import { AddAccountRequest, AddAccountResponse, GetAccountRequest, GetAccountResponse, MakeTransactionRequest, MakeTransactionResponse, Transaction } from "./models";
import { createTransaction, creditOrDebitAccount } from "./transaction_helpers";
import { lambdaWrap } from "./utils";


async function getAccount(r: GetAccountRequest): Promise<GetAccountResponse> {
  return { account: await getUser(r.userEmail) };
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  return { accountId: await addUser(r.account) };
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

  console.log("Called function");

  console.log(transaction.userEmail);

  return createTransaction(transaction);
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
  addAccount: lambdaWrap(addAccount),
  makeTransaction: lambdaWrap(makeTransaction),
  loadTransaction: lambdaWrap(loadTransaction),
}