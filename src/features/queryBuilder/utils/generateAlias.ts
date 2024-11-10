let aliasCounter = 0;
export const generateAlias = (base: string) => `${base}_${aliasCounter++}`;

export const getColumnWithAlias = (column: string, alias?: string) =>
	`${alias ? `${alias}.` : ''}${column}`;
