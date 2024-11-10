import { toSingular } from './toSingular.js';

export const getForeignKeyName = (parentTableName: string): string => {
	const singularParent = toSingular(parentTableName);
	return `${singularParent}id`.toLowerCase();
};
