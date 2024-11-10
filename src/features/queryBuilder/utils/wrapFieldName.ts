export const wrapFieldName = (fieldName: string, tableAlias?: string) => {
	const quotedName = /[A-Z]/.test(fieldName) ? `"${fieldName}"` : fieldName;
	return tableAlias ? `${tableAlias}.${quotedName}` : quotedName;
};
