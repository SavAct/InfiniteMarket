export const regionName = new Intl.DisplayNames(["en"], { type: "region" });
export function getRegion(code: string) {
  if(code.length < 2) return undefined;
  // Additional codes
  switch (code) {
    case "WW":
      return "World Wide";
    }
  const c = regionName.of(code);
  return c;
}

export const euCountryCodes = [
  "AT", // Austria
  "BE", // Belgium
  "BG", // Bulgaria
  "CY", // Cyprus
  "CZ", // Czech Republic
  "DE", // Germany
  "DK", // Denmark
  "EE", // Estonia
  "ES", // Spain
  "FI", // Finland
  "FR", // France
  "GR", // Greece
  "HR", // Croatia
  "HU", // Hungary
  "IE", // Ireland
  "IT", // Italy
  "LT", // Lithuania
  "LU", // Luxembourg
  "LV", // Latvia
  "MT", // Malta
  "NL", // Netherlands
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SE", // Sweden
  "SI", // Slovenia
  "SK", // Slovakia
];

// Get all country codes in which this country is part of from specific entries to unspecific.
export function getCountryCodeGroups(code: string) {
  const arr = [code];
  if(code === 'WW') arr;
  if (code !== 'EU' && euCountryCodes.includes(code)) {
    arr.push("EU");
  }
  arr.push("WW");
  return arr;
}


export const countryCodesNoGroups = [
  // The following is a complete list of the 249 current officially assigned ISO 3166-1 alpha-2 codes,
  // see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
];

export const countryCodes = [
  // Additional codes:
  "WW",
  "EU",

  ...countryCodesNoGroups,
];

// Get all available country codes, but some Nations are mentioned twice:
// function getAllCodes(){
//   const c = 'ABNCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let codes = ['WW']
//   for(const a1 of c){
//       for(const a2 of c) {
//         const code = a1+a2
//         const name = regionName.of(code)
//         if(name === undefined || name.length === 2 || codes.find(v => code === v) !== undefined) continue;
//         console.log(code, regionName.of(code));
//         codes.push(a1+a2);
//       }
//   }
//   return codes;
// }
// export const countryCodes = getAllCodes()
// console.log('countryCodes', countryCodes);

export function combineCountryCodes(codes: string[]) {  
  const result = codes
    .map((code) => {
      const c = getRegion(code);
      return c;
    })
    .join("");
  return result;
}
