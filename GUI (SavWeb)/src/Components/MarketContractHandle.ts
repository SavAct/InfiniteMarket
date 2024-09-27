import type { Ref } from "vue";
import { MarketContract, state } from "../store/globals";
import { ItemTable, TokenSymbol } from "./ContractInterfaces";
import { UserTable } from "./ContractInterfaces";
import { StringToSymbol } from "./AntelopeHelpers";

export function userTableEntryToUser(userTableEntry: UserTable) {
  return {
    ...userTableEntry,
    active: Boolean(userTableEntry.active),
    allowed: userTableEntry.allowed.map((t: TokenSymbol) => {
      return {
        symbol: StringToSymbol(t.sym),
        contract: t.contr,
        chain: t.chain,
      };
    }),
  };
}

// export function isUserTableEntryValid(userTableEntry: UserTable) {
//   return (
//     userTableEntry.pgp !== undefined &&
//     userTableEntry.contact !== undefined &&
//     userTableEntry.allowed !== undefined &&
//     userTableEntry.note !== undefined &&
//     userTableEntry.active !== undefined &&
//     userTableEntry.banned !== undefined
//   );
// }

export class LoadFromContract {
  constructor(
    public loadTries: Ref<number> = Vue.ref(-1)
  ) {
    loadTries.value = -1;
  }

  /**
   * Will set the user from table data
   *
   * @param user User account name
   * @param contract Market contract
   * @param maxTries Number of tries to get the user from table
   * @param waitTime Wait time after each try
   * @returns
   */
  public async loadUser(
    user: string,
    foreUpdate = false,
    contract: MarketContract = state.contract,
    maxTries = 3,
    waitTime = 1000,
  ) {
    this.loadTries.value = 0;

    for (let i = 0; i < maxTries; i++) {
      const tbUser = await state.getUser(user, contract, foreUpdate);
      if (tbUser) {
        return tbUser as UserTable;
      } else {
        // Wait before trying again
        this.loadTries.value++;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    return undefined;
  }

  /**
   * Will set the item from table data
   *
   * @param data id, category and contract names
   * @param maxTries Number of tries to get the item from table
   * @param waitTime Wait time after each try
   */
  public async loadItem(
    data: { id: number; category: bigint } & MarketContract,
    maxTries = 3,
    waitTime = 1000
  ) {
    this.loadTries.value = 0;

    for (let i = 0; i < maxTries; i++) {
      const article = await state.getArticle(data);
      if (article) {
        return article as ItemTable;
      } else {
        // Wait before trying again
        this.loadTries.value++;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    return undefined;
  }
}
