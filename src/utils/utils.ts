import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function reactifyName(name: string): string {
  const noUnderscore = name.replace(/_/g, ' ');
  const nameParts = noUnderscore.split(' ');
  const capitalizedParts = nameParts.map((part, index) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  return capitalizedParts.join('');
}

export function reactifyLowercase(name: string): string {
  const noUnderscore = name.replace(/_/g, ' ');
  const nameParts = noUnderscore.split(' ');
  const capitalizedParts = nameParts.map((part, index) => {
    if (index === 0) {
      return part.toLowerCase();
    } else {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
  });
  return capitalizedParts.join('');
}
