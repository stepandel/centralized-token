import { addUser, getUser } from "./helpers";
import { AddAccountRequest, AddAccountResponse, GetAccountRequest, GetAccountResponse } from "./models";
import { lambdaWrap } from "./utils";


async function getAccount(r: GetAccountRequest): Promise<GetAccountResponse> {
  return { account: await getUser(r.userEmail) };
}

async function addAccount(r: AddAccountRequest): Promise<AddAccountResponse> {
  return { accountId: await addUser(r.account) };
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
  addAccount: lambdaWrap(addAccount),
}