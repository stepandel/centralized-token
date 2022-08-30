import keccak256 from "keccak256";
import { getTable, Table } from "./db_connector";
import { AccountTableEntry, AddAccountRequest, AddAccountResponse, GetAccountRequest, GetAccountResponse, UserAccount } from "./models";
import { lambdaWrap } from "./utils";


async function getAccount(r: GetAccountRequest): Promise<GetAccountResponse> {
  let accountsTable = await getTable(Table.Accounts);

  let id = createTableId(r.userEmail);
  let result = (await accountsTable.findOne({ _id: id })) as AccountTableEntry;

  if (result) {
    let account: UserAccount = {...result};

    return { account };
  }

  throw new Error("User not found");
}

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  let accountsTable = await getTable(Table.Accounts);

  let accountTableEntry: AccountTableEntry = {
    _id: createTableId(r.account.userEmail) as any,
    userEmail: r.account.userEmail,
    status: r.account.status,
    createdAt: r.account.createdAt,
    updatedAt: r.account.updatedAt,
  }

  let result = await accountsTable.insertOne(accountTableEntry);

  console.log("Add to accounts result: ", result);

  return { accountId: result.insertedId.toString() };
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
  addAccount: lambdaWrap(addAccount),
}