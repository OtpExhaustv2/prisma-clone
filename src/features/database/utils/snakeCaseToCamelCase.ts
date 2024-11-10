export const snakeCaseToCamelCase = (str: string): string =>
	str.replace(/([-_][a-zA-Z])/gi, ($1) => {
		return $1.toUpperCase().replace('-', '').replace('_', '');
	});
