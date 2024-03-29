import keccak256 from "keccak256";
import { getTable, Table } from "./db_connector";
import { AccountTableEntry, UserAccount } from "./models";

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

export async function createUser(userEmail: string, status: "active" | "locked"): Promise<string> {
  let userAccount: UserAccount = {
    userEmail,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return addUser(userAccount);
}

export async function addUser(user: UserAccount): Promise<string> {
  let accountsTable = await getTable(Table.Accounts);

  let accountTableEntry: AccountTableEntry = {
    _id: createTableId(user.userEmail),
    userEmail: user.userEmail,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    balance: 0,
  }

  let result = await accountsTable.insertOne(accountTableEntry);

  console.log("Add to accounts result: ", result);

  return result.insertedId.toString();
}

export async function loadUsers(users: UserAccount[]) {
  let accountsTable = await getTable(Table.Accounts);

  // Remove duplicates
  users = removeDuplicates(users);

  let returnPromise: Promise<any>[] = [];
  // Split into batches of 200
  while (users.length > 0) {
    let usersSplice = users.splice(0, 200);
    let userAccounts: AccountTableEntry[] = usersSplice.map( user => {
      return {
        _id: createTableId(user.userEmail),
        ...user,
        balance: 0,
      }
    })
    returnPromise.push(accountsTable.insertMany(userAccounts));
  }

  return Promise.all(returnPromise);
}

function removeDuplicates(accounts: UserAccount[]): UserAccount[] {
  let hashMap: Map<string, boolean> = new Map();
  return accounts.filter( account => {
    let id = createTableId(account.userEmail);
    return hashMap.get(id) ? false : (hashMap.set(id, true));
  });
}

export async function getUser(userEmail: string): Promise<UserAccount> {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(userEmail);
  let result = (await accountsTable.findOne({ _id: id })) as AccountTableEntry;

  if (result) {
    let account: UserAccount = {...result};

    return account;
  }

  throw new Error("User not found");
}

export async function setStatus(userEmail: string, status: "active" | "locked") {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(userEmail);
  return accountsTable.updateOne(
    { _id: id },
    { $set: { status: status, updatedAt: new Date().toISOString() } },
  )
}

export async function isLockedAccount(userEmail: string): Promise<boolean> {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(userEmail);
  let result = (await accountsTable.findOne({ _id: id })) as AccountTableEntry;

  console.log({result})

  if (result) {
    return result.status == "locked";
  }

  // if no account found -- return true
  return true;
}

export async function getAccountBalance(userEmail: string): Promise<number> {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(userEmail);
  let result = (await accountsTable.findOne({ _id: id })) as AccountTableEntry;

  if (result) {
    return result.balance;
  }

  throw new Error("Account not found");
}
