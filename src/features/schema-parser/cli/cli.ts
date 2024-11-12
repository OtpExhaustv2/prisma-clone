#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';

import { generateRelationshipMapping } from '../generateRelationshipMapping.js';
import { generateSQL } from '../generateSQL.js';
import { generateTypescriptTypes } from '../generateTypescriptTypes.js';
import { parse } from '../parse.js';
import { tokenize } from '../tokenize.js';
import { validateSchema } from '../validateSchema.js';

const main = () => {
	const schemaPath = process.argv[2];
	const outputDir = process.argv[3] || 'output';

	if (!schemaPath) {
		console.error('Please provide a schema file path');
		process.exit(1);
	}

	if (!fs.existsSync(schemaPath)) {
		console.error('Schema file does not exist');
		process.exit(1);
	}

	const schema = fs.readFileSync(schemaPath, 'utf8');

	const tokens = tokenize(schema);
	const models = parse(tokens);
	validateSchema(models);
	const relationShipMapping = generateRelationshipMapping(models);
	const tsTypes = generateTypescriptTypes(models);
	const sqlStatements = generateSQL(models);

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	fs.writeFileSync(
		path.join(outputDir, 'relationshipMapping.ts'),
		`export const relationshipMapping: TRelationshipMapping = ${JSON.stringify(
			relationShipMapping,
			null,
			2
		)};`
	);
	fs.writeFileSync(path.join(outputDir, 'models.ts'), tsTypes);
	fs.writeFileSync(path.join(outputDir, 'schema.sql'), sqlStatements);

	console.log('Files generated successfully');
};

main();
