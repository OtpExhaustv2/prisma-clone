export const generateTypescriptTypes = (models: TModel[]): string => {
	return models
		.map((model) => {
			const typeDef = [`export type ${model.name} = {`];

			for (const field of model.fields) {
				const tsType = getTypescriptType(field);
				const optional = field.isNullable ? '?' : '';
				typeDef.push(`  ${field.name}${optional}: ${tsType};`);
			}

			typeDef.push('};');
			return typeDef.join('\n');
		})
		.join('\n\n');
};

export const getTypescriptType = (field: TField): string => {
	if (field.isArray) return `${getBaseType(field.type)}[]`;
	return getBaseType(field.type);
};

export const getBaseType = (type: string): string => {
	switch (type) {
		case 'Int':
			return 'number';
		case 'String':
			return 'string';
		case 'Boolean':
			return 'boolean';
		case 'DateTime':
			return 'Date';
		default:
			return type;
	}
};

export const hasRelation = (field: TField): boolean =>
	field.attributes.some((attr) => attr.name === 'relation');
