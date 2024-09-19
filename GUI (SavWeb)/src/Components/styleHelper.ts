import { state } from "../store/globals";

export function chipBgColor(selected = false) {
  return state.darkStyle.value
    ? selected
      ? "grey-10"
      : "grey-9"
    : selected
      ? "grey-1"
      : "";
}

export function chipBorderStyle(selected = false) {
  return state.darkStyle.value
    ? selected
      ? "border: 1px solid #333333"
      : ""
    : selected
      ? "border: 1px solid #aaaaaa"
      : "";
}