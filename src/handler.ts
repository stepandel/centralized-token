import keccak256 from "keccak256";
import { getTable, Table } from "./db_connector";
import { AddAccountRequest, AddAccountResponse } from "./models";
import { lambdaWrap } from "./utils";


async function getAccount(userEmail: string) {
  console.log({userEmail});

  return "Success";
}

function createTableId(data: any): string {
  return keccak256(data).toString('hex');
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  let accountsTable = await getTable(Table.Accounts);

  let accountTableEntry = {
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