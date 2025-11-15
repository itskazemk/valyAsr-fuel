// انواع وسیله نقلیه ب حسب سایز
export const VehicleType = {
	Car: 1,
	Minibus: 2,
	Bus: 3,
	Motorcycle: 4
} as const;

export type VehicleTypeEnum = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleLabels: Record<VehicleTypeEnum, string> = {
	1: 'سواری',
	2: 'مینی بوس',
	3: 'اتوبوس',
	4: 'موتور سیکلت'
};

// انواع سوخت
export const FuelType = {
	Gasoline: 1,
	Diesel: 2
} as const;

export type FuelTypeEnum = (typeof FuelType)[keyof typeof FuelType];

export const FuelTypeLabels: Record<FuelTypeEnum, string> = {
	1: 'بنزین',
	2: 'گازوییل'
};
