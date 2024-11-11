export const validateRelation = (
	model: TModel,
	field: TField,
	relationAttribute: TAttribute,
	models: TModel[]
): void => {
	const relationArgs = Object.fromEntries(
		relationAttribute.args.map((arg) => {
			const [key, value] = arg.split(':').map((s) => s.trim());
			return [key, value.replace(/[\[\]]/g, '')];
		})
	);

	const referencedModel = models.find((m) => m.name === field.type);

	if (!referencedModel) {
		throw new Error(
			`Model "${model.name}" has a relation to an undefined model: "${field.type}"`
		);
	}

	if (!relationArgs.fields || !relationArgs.references) {
		throw new Error(
			`Relation attribute on field "${field.name}" in model "${model.name}" is missing required arguments: fields and references`
		);
	}

	const referencedFields = relationArgs.references
		.split(',')
		.map((f) => f.trim());
	for (const referencedField of referencedFields) {
		const fieldExists = referencedModel.fields.some(
			(f) => f.name === referencedField
		);
		if (!fieldExists) {
			throw new Error(
				`Field "${referencedField}" referenced in relation "${field.name}" does not exist in model "${referencedModel.name}".`
			);
		}
	}

	const foreignKeyFields = relationArgs.fields.split(',').map((f) => f.trim());
	for (const fkField of foreignKeyFields) {
		const fkFieldExists = model.fields.some((f) => f.name === fkField);
		if (!fkFieldExists) {
			throw new Error(
				`Field "${fkField}" in model "${model.name}" is not a valid field to use as a foreign key`
			);
		}
	}
};
