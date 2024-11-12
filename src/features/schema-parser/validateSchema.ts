import { validateRelation } from './validateRelation.js';

export const validateSchema = (models: TModel[]): void => {
	const modelNames = models.map((model) => model.name);
	for (const model of models) {
		const idFields = model.fields.filter((field) =>
			field.attributes.some((attr) => attr.name === 'id')
		);

		if (idFields.length === 0) {
			throw new Error(`Model "${model.name}" is missing an "id" field!`);
		}

		for (const field of model.fields) {
			if (
				!['Int', 'String', 'Boolean', 'DateTime', ...modelNames].includes(
					field.type
				)
			) {
				throw new Error(
					`Model "${model.name}" has an invalid field type: "${field.type}"`
				);
			}

			const isUnique = field.attributes.some((attr) => attr.name === 'unique');
			if (isUnique && field.isArray) {
				throw new Error(
					`Field "${field.name}" in model "${model.name}" is marked as unique but is an array!`
				);
			}

			const relationAttribute = field.attributes.find(
				(attr) => attr.name === 'relation'
			);
			if (relationAttribute) {
				validateRelation(model, field, relationAttribute, models);
			}
		}
	}
};
