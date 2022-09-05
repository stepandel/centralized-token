import keccak256 from "keccak256";
import { ObjectId } from "mongodb";
import { getTable, Table } from "./db_connector";
import { Transaction, TransactionTableEntry } from "./models";

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

export async function creditOrDebitAccount(userEmail: string, amount: number, credit: boolean): Promise<string> {
  let accountsTable = await getTable(Table.Accounts);
  let transactionsTable = await getTable(Table.Transactions);

  let accountsId = createTableId(userEmail);

  let updateResult = await accountsTable.updateOne(
    { _id: accountsId, balance: { $gt: -amount - 1 } },
    { 
      $inc: { balance: credit ? -amount : amount },
      $set: { updatedAt: new Date().toISOString() },
    },
  )

  if (updateResult.modifiedCount < 1) {
    throw new Error("Sender blance is too low");
  }

  // Create new transaction entry
  let curTS = new Date().toISOString();
  let newTransation: TransactionTableEntry = {
    _id: new ObjectId(),
    userEmail,
    amount,
    type: credit ? "send" : "receive",
    createdAt: curTS,
  }

  let insertResult = await transactionsTable.insertOne(newTransation);

  return insertResult.insertedId.toString();

}

export async function createTransaction(transaction: Transaction) {
  let accountsTable = await getTable(Table.Accounts);
  // Increment user balance
  let accountsId = createTableId(transaction.userEmail);
  accountsTable.updateOne(
    { _id: accountsId },
    { $inc: { balance: transaction.type == "receive" ? transaction.amount : -transaction.amount } },
  )

  // Add transaction record
  let transactionsTable = await getTable(Table.Transactions);
  return transactionsTable.insertOne({
    ...transaction
  });

}

export async function createTransactions(transactions: Transaction[]) {
  let accountsTable = await getTable(Table.Accounts);

  transactions.map( transaction => {
    // Increment user balance
    let accountsId = createTableId(transaction.userEmail);
    accountsTable.updateOne(
      { _id: accountsId },
      { $inc: { balance: transaction.type == "receive" ? transaction.amount : -transaction.amount } },
    );
  });

  // Add transaction record
  let transactionsTable = await getTable(Table.Transactions);
  // Split into batches of 200
  let returnPromise: Promise<any>[] = [];
  while (transactions.length > 0) {
    let transactionsSplice = transactions.splice(0, 200);
    returnPromise.push(transactionsTable.insertMany(transactionsSplice));
  }

  return Promise.all(returnPromise);
}