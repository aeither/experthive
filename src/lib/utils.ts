import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenEthAddress(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return address.slice(0, 4) + "..." + address.slice(-4);
}
