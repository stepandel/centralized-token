## PROPOSED ALTERNATIVE ARCHITECTURE

Currently implemented solution is not an ideal system to be used for financial instrument.
One of the most common vulnerabilities of such a system is a double spend problem.
Blockchains aim to solve the double spend problem thorugh consensus protocol.

Addressing the problem of users spending more than they have or the same amout of money twice
Current design is not ideal and is putting the strain of maanging transactions on the central MongoDB driver.
This allows the asingle point of failure for all transactions. If transaction is to be rejected it will be rejected at the SSOT which is the MongoDB

This is a vaiable solution so long as SSOT is maintained. However, as the token gains utility and aquires actual financial value, and becomes tradable between third parties, SSOT can no longer be manintained at the user's balance level. We will need keep account of the total token supply and only authorise the a certain party to manage the supply.

We can observe, that in order to maintain the sytem to be the SSOT system, we will need to maintain the ledger of every transaction and verify the validity of every new transaction that is created. The transaciton verificaiton falls on the peer consesus protocol.

### Traditional token design

We can set up a token following what has already become a standard for a fungible token using any of our favorite blockchains. For example, ERC-20 for Ethereum blokchain.

In this case, ERC-20 contract becomes the token protocol and Ethereum blockchain becomes the ledger for our accounting system.

User can send the token to any other Ethereum wallet holder so long as they have enough token balance and enough Eth to pay for the gas.

Such design also has it's own drawbacks as it put full responsibility on the users to interract with the blockchain and manage multiple balances in order to cover the gas fees

### Semi-centralized token design

If we prefer to obstract the gas fees from the user and allow as more streamlined token trnsfer approach, we can introduce a relayer which wrap user's trnasactions into the actual tranasaciton creted by our server. This transaction will be send on behalf of the user, signed and paid for by the allocated signer wallet

We could go a step further and bundle up many user transaction into a rolloup which would again be signed and paid for by the allocated signer wallet. Bandling up the transactions into a rollup can dramatically reduce the gas fees without significant impact on security.
