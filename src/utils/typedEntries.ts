export const typeEntries = <T extends Record<string, any>>(obj: T) =>
	Object.entries(obj) as [string, T[keyof T]][];
