import { Ref } from "vue";
import {
  StringToSymbol,
  Token,
  isTableResultWithEntries,
} from "./AntelopeHelpers";
import { savWeb } from "../store/connect";
import { state } from "../store/globals";

async function getTokensData(
  tokenContract: string,
  savpayContract = state.savpayContract
) {
  const chain = savpayContract.chain;
  const result = await savWeb.getTableRows({
    chain,
    code: savpayContract.account,
    table: savpayContract.tables.tokens,
    scope: tokenContract,
  });
  if (isTableResultWithEntries(result)) {
    const t_data = (result as { rows: Array<{ token: string }> }).rows;
    let allTokens = [];
    for (let i = 0; i < t_data.length; i++) {
      if (!t_data[i].token) {
        return undefined;
      }
      const symbol = StringToSymbol(t_data[i].token);
      const t: Token = {
        contract: tokenContract,
        chain,
        symbol,
      };
      allTokens.push(t);
    }
    if (allTokens.length > 0) return allTokens;
  }
  return undefined;
}

export async function get_available_tokens(
  isGetting: Ref<boolean>,
  callBack: (hasError: boolean) => void
) {
  if (isGetting.value) return;
  isGetting.value = true;
  let noError = true;
  const result = await savWeb.getTableByScope({
    chain: state.savpayContract.chain,
    code: state.savpayContract.account,
    table: state.savpayContract.tables.tokens,
    limit: 100, // TODO: Get all available tokens if there are more in the future
  });
  const availableTokens = [];
  if (result && "rows" in result && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      const tokenContract = result.rows[i];
      const t = await getTokensData(tokenContract.scope);
      if (t) {
        availableTokens.push(...t);
      } else {
        noError = false;
      }
    }
  } else {
    noError = false;
  }
  callBack(!noError);
  isGetting.value = false;
  return availableTokens;
}
