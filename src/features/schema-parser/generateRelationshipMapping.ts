import { retrieveFormattedArgs } from './utils/retrieveFormattedArgs.js';

export const generateRelationshipMapping = (
	models: TModel[]
): TRelationshipMapping => {
	const mapping: TRelationshipMapping = {};

	for (const model of models) {
		const modelMapping: Record<
			string,
			{ from: string; to: string; targetTable: string }
		> = {};
		for (const field of model.fields) {
			const relationAttribute = field.attributes.find(
				(attr) => attr.name === 'relation'
			);
			if (relationAttribute) {
				const relationArgs = retrieveFormattedArgs(relationAttribute.args);
				const targetTable = field.type;
				const from = relationArgs.fields;
				const to = relationArgs.references;

				modelMapping[field.name] = { from, to, targetTable };

				const reverseRelation = models.find(
					(model) => model.name === targetTable
				);

				const reverseField = reverseRelation?.fields.find(
					(field) => field.type === model.name
				);

				if (!reverseField) {
					continue;
				}

				if (!mapping[targetTable]) {
					mapping[targetTable] = {};
				}

				const reverseFieldName = reverseField?.name ?? model.name.toLowerCase();

				mapping[targetTable][reverseFieldName] = {
					from: to,
					to: from,
					targetTable: model.name,
				};
			}
		}

		if (Object.keys(modelMapping).length > 0) {
			mapping[model.name] = modelMapping;
		}
	}

	return mapping;
};
