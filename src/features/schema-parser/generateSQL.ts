import { retrieveFormattedArgs } from './utils/retrieveFormattedArgs.js';

export const generateSQL = (models: TModel[]): string => {
	const sqlStatements = models.map((model) => {
		const tableDefinition = [`CREATE TABLE ${model.name} (`];

		const fieldsDefinition = model.fields
			.filter((field) => !isRelationReferenceOnly(field))
			.map((field) => {
				const isId = field.attributes.some((attr) => attr.name === 'id');
				if (isId) {
					return `${field.name} SERIAL PRIMARY KEY `;
				}

				let fieldDef = `${field.name} ${getSQLType(field)}`;

				if (field.attributes.some((attr) => attr.name === 'unique')) {
					fieldDef += ' UNIQUE';
				}
				const defaultAttr = field.attributes.find(
					(attr) => attr.name === 'default'
				);
				if (defaultAttr && defaultAttr.args[0] !== 'autoincrement()') {
					fieldDef += ` DEFAULT ${defaultAttr.args[0]}`;
				}

				return fieldDef;
			});

		const relationConstraints = model.fields
			.filter((field) =>
				field.attributes.some((attr) => attr.name === 'relation')
			)
			.map((field) => generateForeignKeyConstraint(model, field));

		tableDefinition.push(
			fieldsDefinition.concat(relationConstraints).join(', ')
		);
		tableDefinition.push(');');

		return tableDefinition.join('');
	});

	return sqlStatements.join('');
};

export const isRelationReferenceOnly = (field: TField): boolean => {
	if (field.isArray) {
		return true;
	}
	const relationAttr = field.attributes.find(
		(attr) => attr.name === 'relation'
	);
	if (!relationAttr) {
		return false;
	}

	const relationArgs = retrieveFormattedArgs(relationAttr.args);
	const foreignKeyFields = relationArgs.fields.split(',').map((f) => f.trim());
	return !foreignKeyFields.includes(field.name);
};

export const generateForeignKeyConstraint = (
	model: TModel,
	field: TField
): string => {
	const relationAttr = field.attributes.find(
		(attr) => attr.name === 'relation'
	);
	if (!relationAttr) {
		throw new Error(
			`Field ${field.name} in model ${model.name} is missing relation attribute`
		);
	}

	const relationArgs = retrieveFormattedArgs(relationAttr.args);

	return `FOREIGN KEY (${relationArgs.fields}) REFERENCES ${field.type}(${relationArgs.references})`;
};

export const getSQLType = (field: TField): string => {
	switch (field.type) {
		case 'String':
			return 'TEXT';
		case 'Int':
			return 'INTEGER';
		case 'Boolean':
			return 'BOOLEAN';
		default:
			throw new Error(`Unsupported type: ${field.type}`);
	}
};
