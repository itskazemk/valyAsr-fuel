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

export const Units = [
	{ label: 'فرماندهی', value: 1 },
	{ label: 'حفاظت', value: 2 },
	{ label: 'حوزه', value: 3 },
	{ label: 'ایمنی', value: 4 },
	{ label: 'بازرسی', value: 5 },
	{ label: 'نیرو انسانی', value: 6 },
	{ label: 'طرح و برنامه', value: 7 },
	{ label: 'قرارگاه', value: 8 },
	{ label: 'مهندسی', value: 9 },
	{ label: 'آماد و پشتیبانی', value: 10 },
	{ label: 'آموزش', value: 11 },
	{ label: 'بهداری', value: 12 },
	{ label: 'فرهنگی', value: 13 },
	{ label: 'تربیت بدنی', value: 14 },
	{ label: 'تیپ آموزش-گردان اول', value: 15 },
	{ label: 'تیپ آموزش-گردان دوم', value: 16 },
	{ label: 'فاوا', value: 17 },
];

export function ownerUnitSelect(unitNum: number) {
	return Units.find((item) => item.value === unitNum)?.label;
}
