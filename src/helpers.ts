import keccak256 from "keccak256";
import { getTable, Table } from "./db_connector";
import { AccountTableEntry, UserAccount } from "./models";

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

export async function addUser(user: UserAccount): Promise<string> {
  let accountsTable = await getTable(Table.Accounts);

  let accountTableEntry: AccountTableEntry = {
    _id: createTableId(user.userEmail) as any,
    userEmail: user.userEmail,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }

  let result = await accountsTable.insertOne(accountTableEntry);

  console.log("Add to accounts result: ", result);

  return result.insertedId.toString();
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
