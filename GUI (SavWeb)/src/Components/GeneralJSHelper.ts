export function deepCopyArray<T>(originalArray: T[]): T[] {
  let copy: T[] = [];
  for (let i = 0; i < originalArray.length; i++) {
    if (Array.isArray(originalArray[i])) {
      copy[i] = deepCopyArray(originalArray[i] as any) as any;
    } else if (
      typeof originalArray[i] === "object" &&
      originalArray[i] !== null
    ) {
      copy[i] = deepCopyObject(originalArray[i] as any) as any;
    } else {
      copy[i] = originalArray[i];
    }
  }
  return copy;
}

export function deepCopyObject<T>(originalObject: T): T {
  let copy: any = {};
  for (let key in originalObject) {
    if (Array.isArray(originalObject[key])) {
      copy[key] = deepCopyArray(originalObject[key] as any);
    } else if (
      typeof originalObject[key] === "object" &&
      originalObject[key] !== null
    ) {
      copy[key] = deepCopyObject(originalObject[key] as any);
    } else {
      copy[key] = originalObject[key];
    }
  }
  return copy;
}

export const hourInMin = 60;
export const dayInMin = 24 * hourInMin;
export const weekInMin = 7 * dayInMin;
export const monthInMin = 30 * dayInMin;

export const minInMs = 60 * 1000;
export const hourInMs = 60 * minInMs;
export const dayInMs = 24 * hourInMs;
export const weekInMs = 7 * dayInMs;
export const monthInMs = 30 * dayInMs;

export function deepCopy(original: any): any {
  if (Array.isArray(original)) {
    return deepCopyArray(original);
  } else if (typeof original === "object" && original !== null) {
    return deepCopyObject(original);
  } else {
    return original;
  }
}

/**
 * Get duration unit and number based from a value in milliseconds
 * @param msValue Duration in milliseconds
 */
export function getInitialDuration(msValue: number): {
  unit: "months" | "weeks" | "days" | "hours" | "minutes";
  n: number;
} {
  const value = Math.floor(msValue / 60000);
  if (value % monthInMin === 0) {
    return { unit: "months", n: value / monthInMin };
  } else if (value % weekInMin === 0) {
    return { unit: "weeks", n: value / weekInMin };
  } else if (value % dayInMin === 0) {
    return { unit: "days", n: value / dayInMin };
  } else if (value % hourInMin === 0) {
    return { unit: "hours", n: value / hourInMin };
  } else {
    return { unit: "minutes", n: value };
  }
}

function roundToPrecision(value: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function getRoundedDuration(msValue: number, precision = 0): {
  unit: "months" | "weeks" | "days" | "hours" | "minutes";
  n: number;
} {
  const value = Math.floor(msValue / 60000);
  if (value >= monthInMin) {
    return { unit: "months", n: roundToPrecision(value / monthInMin, precision) };
  } else if (value >= weekInMin) {
    return { unit: "weeks", n: roundToPrecision(value / weekInMin, precision) };
  } else if (value >= dayInMin) {
    return { unit: "days", n: roundToPrecision(value / dayInMin, precision) };
  } else if (value >= hourInMin) {
    return { unit: "hours", n: roundToPrecision(value / hourInMin, precision) };
  } else {
    return { unit: "minutes", n: roundToPrecision(value, precision) };
  }
}

/**
 * Get duration from duration unit and number in milliseconds
 * @param unit Duration unit
 * @param value Duration number in duration unit
 */
export function getDuration(
  unit: "months" | "weeks" | "days" | "hours" | "minutes",
  value: number
) {
  switch (unit) {
    case "months":
      return value * monthInMs;
    case "weeks":
      return value * weekInMs;
    case "days":
      return value * dayInMs;
    case "hours":
      return value * hourInMs;
    case "minutes":
      return value * minInMs;
  }
}
