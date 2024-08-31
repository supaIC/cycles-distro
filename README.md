## Cycles Distrobution
### Version 1.3.4
This repository is designed to help you automate topping up your Internet Computer canisters by launching your own cycles distrobution smart contract. Just clone this repo and follow the steps below to get started!

### Getting Setup:

You will need DFX and NodeJS setup to use this repo. This project uses the Azle developent kit. If you need help getting setup, check out these links:

DFX Setup: https://internetcomputer.org/docs/current/developer-docs/getting-started/install
NodeJS Setup: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
Azle Docs: https://github.com/demergent-labs/azle

#### Clone The Repo:

```
git clone https://github.com/supaic/cycles-distro.git
cd cycles-distro
```

#### Project Setup:

As long as you have already installed and configured Node and DFX, the easy setup command should take care of everything for you:

```
npm run setup
```

If for some reason the automatic command doesn't work, you can use the manual commands:

```
npm install && npm audit fix
dfx start --clean --background
dfx canister create --all
dfx build
dfx deploy
dfx stop
```

### Managing The Distro Canister

Now that you have your project setup initially, it's time to populate your list of canisters that need cycles distrobution. The canister comes with an empty list of canister addresses that only the owner can manage. You can do that by utilizing the following functions:

#### Read Distro List:

```
dfx canister call distro canisterList
```

#### Add Canister To Distro List:

```
dfx canister call distro addCanister <CanisterIDAsString>
```

#### Remove Canister From Distro List:

```
dfx canister call distro removeCanister <CanisterIDAsString>
```

### Activate Distrobution:

After you have populated your canister list, you can now try topping up all of your canisters using this smart contract. The distro canister is designed to act as a cycles holding bank that distributes the cycles to each of the canisters when called upon. Here are the following commands for interacting with the distro canister:

#### Single Canister Top-up:

This will top up a single canister of your choice with an amount of your choice in cycles:

```
dfx canister call distro addCycles '( "<CanisterID>", <bigint> )'
```

Note: `<bigint>` refers to a number representing the amount of cycles to the exact decimal (Ex: 1T = 1000000000000).

#### Multi Canister Top-up:

This will top up all canisters on the list with an amount of your choice. As of currently it equally distributes the cycles amongst all canisters:

```
dfx canister call distro addCyclesToAll <bigint>
```

Note: `<bigint>` refers to a number representing the amount of cycles to the exact decimal (Ex: 1T = 1000000000000).

#### Deploy To Mainnet

Note: This package currently doesn't support topping up on local deployment, there are plans for this in the future. For now, please deploy to the mainnet.

If you have a cycles wallet configured with your identity in DFX, you can launch your distrobution canister to the mainnet. This can be done by letting DFX create a new canister for you using:

```
dfx deploy --network ic
```

After deployment, when you call the functions make sure to add `--network ic` after `dfx canister` so that your call reaches your mainnet version.

### Future Plans:

- Multiple modes (automatic, timed, manual)
- Accept json list as an option for setup
- Role support (admin/owner).
- Embedded frontend.
- Local DFX environment support.