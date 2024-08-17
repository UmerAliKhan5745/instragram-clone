import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs:any) {
  return twMerge(clsx(inputs))
}

export const readFileAsDataURL = (file:any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })
}