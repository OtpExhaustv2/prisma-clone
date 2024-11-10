import { typeEntries } from '../../../utils/typedEntries.js';
import { relationshipMapping } from '../../database/contants/relationshipMapping.js';
import { buildWhereClause } from './buildWhereClause.js';
import { generateAlias } from './generateAlias.js';

export type TBuildJoinClauseReturn = {
	joinClause: string | null;
	values: any[];
	aliasMap: Record<string, string>;
	aliasIndex: { current: number };
};

export const buildJoinClause = <T extends TEntity>(p: {
	include: TIncludes<T> | undefined;
	parentTableName: string;
	parentAlias: string;
	aliasIndex: { current: number };
	aliasMap: Record<string, string>;
}): TBuildJoinClauseReturn => {
	const joinParts: string[] = [];
	const values: any[] = [];

	const { include, parentTableName, parentAlias, aliasIndex, aliasMap } = p;

	if (!include) {
		return {
			joinClause: null,
			values,
			aliasMap,
			aliasIndex: { current: 1 },
		};
	}

	for (const [relationKey, config] of typeEntries(include)) {
		const relationMetadata =
			relationshipMapping[parentTableName]?.[relationKey];

		if (!relationMetadata) continue;

		const relationAlias = generateAlias(relationKey);
		aliasMap[relationKey] = relationAlias;

		const { targetTable, from, to } = relationMetadata;
		const targetTableWithSchema = `"public".${targetTable}`;

		const joinCondition = `${parentAlias}.${from} = ${relationAlias}.${to}`;

		if (typeof config === 'boolean') {
			joinParts.push(
				`JOIN ${targetTableWithSchema} AS ${relationAlias} ON ${joinCondition}`
			);
		} else {
			if (!config) continue;
			if (config.where) {
				const { clause: whereClause, values: whereValues } = buildWhereClause({
					whereClause: config.where,
					parentTableName: relationKey,
					parentAlias: relationAlias,
					paramIndex: aliasIndex,
					aliasMap,
				});
				values.push(...whereValues);

				joinParts.push(
					`JOIN ${targetTableWithSchema} AS ${relationAlias} ON ${joinCondition} ${
						whereClause ? `AND ${whereClause}` : ''
					}`
				);
			} else {
				joinParts.push(
					`JOIN ${targetTableWithSchema} AS ${relationAlias} ON ${joinCondition}`
				);
			}
			if (config.include) {
				const nestedJoinResult = buildJoinClause({
					include: config.include,
					parentTableName: targetTable,
					parentAlias: relationAlias,
					aliasIndex,
					aliasMap,
				});
				if (nestedJoinResult.joinClause) {
					joinParts.push(nestedJoinResult.joinClause);
					Object.assign(aliasMap, nestedJoinResult.aliasMap);
					values.push(...nestedJoinResult.values);
				}
			}
		}
	}

	return {
		joinClause: joinParts.join('\n'),
		values,
		aliasMap,
		aliasIndex,
	};
};
