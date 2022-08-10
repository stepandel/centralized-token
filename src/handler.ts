import { lambdaWrap } from "./utils";


async function getAccount(userEmail: string) {
  console.log({userEmail});

  return "Success";
}


module.exports = {
  getAccount: lambdaWrap(getAccount),
}