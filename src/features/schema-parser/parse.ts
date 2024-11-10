export const parse = (tokens: TToken[]): TModel[] => {
	const models: TModel[] = [];

	let currentModel: TModel | null = null;
	let currentField: TField | null = null;

	for (const token of tokens) {
		switch (token.type) {
			case 'MODEL':
				if (currentModel) {
					models.push(currentModel);
				}
				const modelName = token.value.split(' ')[1];
				currentModel = { name: modelName, fields: [] };
				break;

			case 'FIELD':
				if (!currentModel) throw new Error('Field outside of model context!');
				const [fieldName, fieldType, isArray] = token.value
					.match(/(\w+)\s+(\w+)(\[\])?/)!
					.slice(1);

				currentField = {
					name: fieldName,
					type: fieldType,
					isArray: !!isArray,
					attributes: [],
				};
				currentModel.fields.push(currentField);
				break;

			case 'ATTRIBUTE':
				if (!currentField)
					throw new Error('Attribute outside of field context!');
				const [attributeName, attributeArgs] = token.value
					.match(/@(\w+)(\(([^)]+)\))?/)!
					.slice(1);
				currentField.attributes.push({
					name: attributeName,
					args: attributeArgs ? attributeArgs.split(',') : [],
				});
				break;
			case 'BRACE_OPEN':
				break;
			case 'BRACE_CLOSE':
				if (currentModel) {
					models.push(currentModel);
					currentModel = null;
				}
				break;
		}
	}

	return models;
};
