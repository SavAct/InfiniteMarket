import { savWeb } from "../store/connect";
import { state } from "../store/globals";
import { isSameChain } from "./AntelopeHelpers";
import { PublicAccount } from "./SavWeb";

/**
 * Get the login user via the browser
 * @param name Optional predefine a user name
 * @returns
 */
export async function requestLoginUser(name?: string) {
  let user: PublicAccount | undefined = undefined;
  if (name !== undefined) {
    name = name.trim();
    user = name.length > 0 ? { name } : undefined;
  }

  const resultUser = await savWeb.getUser(user, 60000);
  // Check if chain is the same as the shop contract
  if (
    resultUser &&
    resultUser.chain !== undefined &&
    isSameChain(resultUser.chain, state.contract.chain) !== true
  ) {
    Quasar.Notify.create({
      message: "Wrong chain",
      caption: `Please connect the browser with an account on the ${state.contract.chain} chain.`,
      type: "negative",
      position: "top",
    });
    return;
  }

  state.loginUser.value = resultUser;
  return resultUser;
}
