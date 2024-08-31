import { Principal, $query, $update, $init, ic, Result, match, Vec } from 'azle';
import { managementCanister } from 'azle/canisters/management';

// Defines the type for the internal canister list.
export type DistroList = Vec<string>;

// Defines the internal state variables (not stable memory).
let owner: string = "";
const distroList: DistroList = [];

// Sets the canister owner on initialization.
$init
export function init(): void {
    owner = ic.caller().toText();
}

// Grab the list of canisters that are to receive cycles.
$query
export async function canisterList(): Promise<DistroList> {
    if (ic.caller().toText() === owner) {
        return distroList;
    } else {
        return ["Only the owner can view the canister list."];
    }
}

// Adds a canister to the distrobution list.
$update
export async function addCanister(canisterID: string): Promise<string> {
    if (ic.caller().toText() !== owner) {
        return "Only the owner can add canisters.";
    } else {
        distroList.push(canisterID);
        return "Canister added.";
    }
}

// Removes a canister from the distrobution list.
$update
export async function removeCanister(canisterID: string): Promise<string> {
    if (ic.caller().toText() !== owner) {
        return "Only the owner can remove canisters.";
    } else {
        const index = distroList.indexOf(canisterID);
        if (index > -1) {
            distroList.splice(index, 1);
            return "Canister removed.";
        } else {
            return "Canister not found.";
        }
    }
}

// Manually adds cycles to a single specific canister of choice.
$update;
export async function addCycles(canisterID: string, amount: bigint): Promise<Result<boolean, string>> {
    if (ic.caller().toText() !== owner) {
        return { Err: "Only the owner can add cycles." };
    } else {
        const callResult = await managementCanister
        .deposit_cycles({
            canister_id: Principal.from(canisterID),
        })
        .cycles(amount)
        .call();

        return match(callResult, {
            Ok: () => ({ Ok: true }),
            Err: (err) => ({ Err: err })
        });
    }
}

// amount means total number of cycles, this needs to be equally divided among all canisters.
$update;
export async function addCyclesToAll(amount: bigint): Promise<string> {
    if (ic.caller().toText() !== owner) {
        return "Only the owner can add cycles.";
    } else {
        const listLength = distroList.length;
        const cyclesPerCanister = amount / BigInt(listLength);
        distroList.forEach(async (canisterID) => {
            const callResult = await managementCanister
            .deposit_cycles({
                canister_id: Principal.from(canisterID),
            })
            .cycles(cyclesPerCanister)
            .call();
        });
        return "Cycles added to all canisters.";
    }
}