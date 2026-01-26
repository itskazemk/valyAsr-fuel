import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function anyNull(obj: object) {
	return Object.values(obj).some((v) => v === null);
}

export function plateShower(plate: string) {
	// return plate;

	const plateSplitted = plate.split('_');

	return `${plateSplitted?.at(0)} ${plateSplitted?.at(1)} ${plateSplitted?.at(2)} ${plateSplitted?.at(3)}`;
}
