export const toSingular = (key: string) =>
	key.endsWith('s') ? key.slice(0, -1) : key;
