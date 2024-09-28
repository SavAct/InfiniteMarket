import { savWeb } from "../store/connect";
import { state } from "../store/globals";

export interface AssetSymbol {
  precision: number;
  name: string;
}

export interface Asset {
  amount: bigint;
  symbol: AssetSymbol;
}

export interface Token {
  symbol: AssetSymbol;
  contract: string;
  chain: string;
}

export function StringToSymbol(symbol_str: string): AssetSymbol {
  const [precision_str, name] = symbol_str.split(",");
  return { precision: parseInt(precision_str), name };
}

/**
 * Convert an asset in string format to an asset object
 * @param asset_str Asset as string
 * @param precision Decimal places. Convert to this, if defined.
 * @returns Asset object
 */
export function StringToAsset(asset_str: string, precision?: number) {
  // Get symbol name and amount string
  const e = asset_str.indexOf(" ");
  if (e == -1) {
    return undefined;
  }
  const name = asset_str.substring(e + 1);
  const amount_str = asset_str.substring(0, e).replace(/[^0-9.,]/g, "");

  // Get precision and amount
  const s = amount_str.indexOf(".");
  let amount: bigint;
  if (s == -1) {
    if (precision === undefined) {
      precision = 0;
      amount = BigInt(amount_str);
    } else {
      amount = BigInt(amount_str + "0".repeat(precision));
    }
  } else {
    let decimals: string;
    const sp = s + 1;
    if (precision === undefined) {
      precision = amount_str.length - sp;
      decimals = amount_str.substring(sp);
    } else {
      decimals = amount_str
        .substring(sp)
        .padEnd(precision, "0")
        .substring(0, precision);
    }
    amount = BigInt(amount_str.substring(0, s) + decimals);
  }
  return { amount, symbol: { precision, name } } as Asset;
}

export function AssetToString(asset: Asset) {
  const s = asset.amount.toString().padStart(asset.symbol.precision, "0");
  const p = s.length - asset.symbol.precision;
  const int = s.substring(0, p);
  return `${int ? int : "0"}${
    asset.symbol.precision > 0 ? "." : ""
  }${s.substring(p)} ${asset.symbol.name}`;
}

/**
 * Check if a name has valid characters or not
 * @param val User account name
 * @returns true if valid otherwise an error message
 */
function userValidChars(val: string): boolean | string {
  let valid = true;
  for (const c of val) {
    if ("abcdefghijklmnopqrstuvwxyz12345.".indexOf(c) == -1) {
      valid = false;
    }
  }
  if (valid === true) {
    if (val.startsWith("0")) {
      return "It is not allowed to start the name with a dot!";
    }
    if (val.endsWith(".")) {
      return "It is not allowed to end the name with a dot!";
    }
    return true;
  }
  return "Only characters from a to z, 1 to 5 and the dot is allowed for account names!";
}

/**
 * Check offline if a account name or public key is valid
 * @param user Account name or public key
 * @returns true if valid else an error message
 */
export function checkUserOffline(user: string) {
  if (user.startsWith("EOS") || user.startsWith("PUB_")) {
    // Public key

    return eosjs_ecc.isValidPublic(user) ? true : "Invalid public key";
  } else {
    // User name
    if (user.length > 0 && user.length <= 13) {
      return userValidChars(user);
    } else {
      return "User name must be between 1 and 13 characters";
    }
  }
}

/**
 * Check if a account name is valid
 * @param userName User account name
 * @param useErrMsg Show error message if user name is invalid
 * @param chain Chain name, id or label
 * @returns true if valid else false, undefined or return an error message
 */
export async function checkUserOnline(
  userName: string,
  useErrMsg: boolean = true,
  chain: string = state.contract.chain
) {
  // Check if user exists
  if (userName === state.loginUser.value) {
    return true;
  }
  if (userName.trim().length == 0) {
    Quasar.Notify.create({
      message: "Please enter a valid user name",
      caption: `If you do not have one create an user account on ${chain} first.`,
      color: "red",
      position: "top",
    });
    return false;
  }
  const userExists = await savWeb.checkName(chain, userName);
  if (userExists !== true && useErrMsg === true) {
    Quasar.Notify.create({
      message:
        userExists === false
          ? "Could not find the user name"
          : "User does not exist on blockchain",
      caption:
        userExists === false
          ? `Create an user account on ${chain} first.`
          : undefined,
      color: "red",
      position: "top",
    });
  }
  return userExists;
}

/**
 * get the id of a chain if the chain is known
 * @param chain Chain name, id or label
 * @returns Chain id or undefined
 */
export function getKnownChainId(chain: string) {
  return AllChains.find(
    (c) => c.value === chain || c.id === chain || c.label === chain
  )?.id;
}

/**
 * Check if two chains are the same
 * @param chain_A Chain name, id or label
 * @param chain_B Chain name, id or label
 * @returns undefined if a chain is not known, true if the chains are the same else false
 */
export function isSameChain(chain_A: string, chain_B: string) {
  const idA = getKnownChainId(chain_A);
  const idB = getKnownChainId(chain_B);
  if (idA === undefined || idB === undefined) return undefined;
  return idA === idB;
}

/**
 *  Converts a %name Base32 symbol into its corresponding value
 *
 *  @param c - Character to be converted
 *  @return constexpr char - Converted value
 */
function char_to_value(c: string): number {
  if (c == ".") return 0;
  else if (c >= "1" && c <= "5") return c.charCodeAt(0) - "1".charCodeAt(0) + 1;
  else if (c >= "a" && c <= "z") return c.charCodeAt(0) - "a".charCodeAt(0) + 6;
  else throw new Error("Character is not in allowed character set for names");
}

export function nameToBigInt(name: string) {
  if (name.length > 13)
    throw new Error("string is too long to be a valid name");
  let value = BigInt(0);
  const n = Math.min(name.length, 12);
  for (let i = 0; i < n; ++i) {
    value = value << BigInt(5);
    value = value | BigInt(char_to_value(name[i]));
  }
  value = value << BigInt(4 + 5 * (12 - n));

  if (name.length == 13) {
    const v = BigInt(char_to_value(name[12]));
    if (v > BigInt(0x0f)) {
      throw new Error(
        "Thirteenth character in name cannot be a letter that comes after j"
      );
    }
    value = value | v;
  }
  return value;
}

export function isValidTableResult(result: any) {
  return result && "rows" in result && Array.isArray(result?.rows);
}

export function isTableResultWithEntries(result: any) {
  return isValidTableResult(result) && result.rows.length > 0;
}

export const AllChains = [
  {
    label: "EOS",
    value: "eos",
    id: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  },
  {
    label: "WAX",
    value: "wax",
    id: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
  },
  {
    label: "BEOS",
    value: "beos",
    id: "cbef47b0b26d2b8407ec6a6f91284100ec32d288a39d4b4bbd49655f7c484112",
  },
  {
    label: "BOS",
    value: "bos",
    id: "d5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86",
  },

  {
    label: "FIO",
    value: "fio",
    id: "21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c",
  },
  {
    label: "Insights",
    value: "insights",
    id: "b042025541e25a472bffde2d62edd457b7e70cee943412b1ea0f044f88591664",
  },
  {
    label: "MEET.ONE",
    value: "meetone",
    id: "cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422",
  },
  {
    label: "Proton",
    value: "proton",
    id: "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0",
  },
  {
    label: "Telos",
    value: "telos",
    id: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
  },
  {
    label: "Worbli",
    value: "worbli",
    id: "73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f",
  },
  {
    label: "Lamington Testnet",
    value: "lamington",
    id: "8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b",
  },
];
