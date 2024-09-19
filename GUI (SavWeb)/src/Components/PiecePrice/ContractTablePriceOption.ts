import { PiecesPrice } from "../ContractInterfaces";

export enum PriceOption {
  One = 0,
  Multiple = 1,
  Predefined = 2,
}

export function GetParamsFromTablePricePiece(
  pp: Array<PiecesPrice> | undefined
) {
  let priceOption: PriceOption = PriceOption.One;
  let maxPieces: number | undefined = undefined;

  let piecePrices: Array<PiecesPrice> = pp ? [...pp] : []; // Copy array pp to avoid mutation

  if (pp !== undefined && pp.length > 0) {
    piecePrices.sort((a, b) => (BigInt(a.pcs) - BigInt(b.pcs) > 0 ? 1 : -1));
    if (Number(piecePrices[0].pcs) === 0) {
      let vO = piecePrices.shift()?.p;
      if (vO === undefined) {
        priceOption = PriceOption.Multiple;
      } else {
        vO = Number(vO);
        if (vO === 0) {
          priceOption =
            piecePrices.length > 1 ? PriceOption.Predefined : PriceOption.One;
        } else {
          priceOption = PriceOption.Multiple;
          maxPieces = vO;
        }
      }
    } else {
      priceOption = PriceOption.Multiple;
    }
  }
  return { priceOption, maxPieces, piecePrices };
}
