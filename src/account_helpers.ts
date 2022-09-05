import keccak256 from "keccak256";
import { getTable, Table } from "./db_connector";
import { AccountTableEntry, UserAccount } from "./models";

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

export async function addUser(user: UserAccount): Promise<string> {
  let accountsTable = await getTable(Table.Accounts);

  let accountTableEntry: AccountTableEntry = {
    _id: createTableId(user.userEmail),
    userEmail: user.userEmail,
    status: user.status,
    createdAt: user.createdAt,
    balance: 0,
  }

  let result = await accountsTable.insertOne(accountTableEntry);

  console.log("Add to accounts result: ", result);

  return result.insertedId.toString();
}

export async function loadUsers(users: UserAccount[]) {
  let accountsTable = await getTable(Table.Accounts);

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
    await accountsTable.insertMany(userAccounts);
  }
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

export async function isLockedAccount(userEmail: string): Promise<boolean> {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(userEmail);
  let result = (await accountsTable.findOne({ _id: id })) as AccountTableEntry;

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
