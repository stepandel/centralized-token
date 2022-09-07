const { default: axios } = require("axios");
const fs = require("fs").promises;

const BASE_URL = "http://localhost:3000/dev/";

let testman1;
let testman2;

describe('Ledn Token', function() {

  beforeAll(async function() {
    // load accounts
    let accountsRaw = await fs.readFile("accounts-api.json");
    let accounts = JSON.parse(accountsRaw);
    await axios.post(BASE_URL + "loadAccounts", accounts);
    testman1 = accounts[0];
    testman2 = accounts[1];
    // // load transactions
    let transactionsRaw = await fs.readFile("transactions-api.json");
    let transactions = JSON.parse(transactionsRaw);
    await axios.post(BASE_URL + "loadTransactions", transactions);
  });

  it('Get account and balance', async function() {
    let result = await axios.post(BASE_URL + "getAccount", { userEmail: testman1.userEmail });

    expect(result.data.account.userEmail).toBe(testman1.userEmail);
    expect(result.data.account.balance).toBeGreaterThanOrEqual(0);
  });

  it('Lock acocunt',  async function() {
    await axios.post(BASE_URL + "updateStatus", { userEmail: testman1.userEmail, status: "locked" });
    let result = await axios.post(BASE_URL + "getAccount", { userEmail: testman1.userEmail });

    expect(result.data.account.status).toBe("locked");
  })

  it('Unlock account',  async function() {
    await axios.post(BASE_URL + "updateStatus", { userEmail: testman1.userEmail, status: "active" });
    let result = await axios.post(BASE_URL + "getAccount", { userEmail: testman1.userEmail });

    expect(result.data.account.status).toBe("active");
  })

  it('Send transaction - success',  async function() {
    let balanceOne = (await axios.post(BASE_URL + "getAccount", { userEmail: testman1.userEmail })).data.account.balance;
    let balanceTwo = (await axios.post(BASE_URL + "getAccount", { userEmail: testman2.userEmail })).data.account.balance;
    let result = await axios.post(BASE_URL + "makeTransaction", { from_email: testman1.userEmail, to_email: testman2.userEmail, amount: 10 });

    expect(result.data.sender_balance).toBe(balanceOne - 10);
    expect(result.data.receiver_balance).toBe(balanceTwo + 10);
  })

  it('Send trnsaction - account locked - fail',  async function() {
    await axios.post(BASE_URL + "updateStatus", { userEmail: testman1.userEmail, status: "locked" });

    await expect(axios.post(BASE_URL + "makeTransaction", { from_email: testman1.userEmail, to_email: testman2.userEmail, amount: 10 })).rejects.toThrow();
  })

  it('Send tranaction - low balance - fail',  async function() {
    let balanceOne = (await axios.post(BASE_URL + "getAccount", { userEmail: testman1.userEmail })).data.account.balance;

    await expect(axios.post(BASE_URL + "makeTransaction", { from_email: testman1.userEmail, to_email: testman2.userEmail, amount: balanceOne + 1 })).rejects.toThrow();
  })
});