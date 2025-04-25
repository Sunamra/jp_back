import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const positionOrS = (num) => {
  return num == 1 ? "Position" : (num > 1 ? "Positions" : "")

}

export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export const shortenFilename = (name) => {
  if (String(name).length > 40) {
      let temp1 = name.slice(0, 10);
      let temp2 = name.slice(-15);
      name = temp1 + "..." + temp2;
  }
  return name;
}