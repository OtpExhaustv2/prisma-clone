import { typeEntries } from '../../../utils/typedEntries.js';
import { comparisonOperatorMapping } from '../constants/comparisonOperatorMapping.js';
import { wrapFieldName } from './wrapFieldName.js';

export type TBuildWhereClauseReturn = {
	clause: string;
	values: any[];
};

export const buildWhereClause = <T extends TEntity>(p: {
	whereClause: TWhereCondition<T> | undefined;
	parentTableName: string;
	parentAlias: string;
	paramIndex: { current: number };
	aliasMap: Record<string, string>;
}): TBuildWhereClauseReturn => {
	const clauseParts: string[] = [];
	const values: any[] = [];

	const { whereClause, parentTableName, parentAlias, aliasMap, paramIndex } = p;

	const parseCondition = (key: string, condition: any) => {
		const tableAlias = aliasMap[parentTableName] || aliasMap.root;
		const fieldName = wrapFieldName(key, tableAlias);
		if (
			typeof condition === 'object' &&
			condition !== null &&
			!Array.isArray(condition)
		) {
			// Iterate over the operators and values within the condition (e.g., { eq: 'John', gt: 25 })
			for (const [operator, value] of typeEntries(condition)) {
				const sqlOperator =
					comparisonOperatorMapping[
						operator as TSQLComparisonOperatorAbbreviated
					];

				if (!sqlOperator) continue;

				if (
					(sqlOperator === 'IN' || sqlOperator === 'NOT IN') &&
					Array.isArray(value)
				) {
					const placeholders = value
						.map(() => `$${paramIndex.current++}`)
						.join(', ');
					values.push(...value);
					clauseParts.push(`${fieldName} ${sqlOperator} (${placeholders})`);
				} else {
					// Handle LIKE operators with wildcard placement
					let formattedValue = value;
					if (operator === 'startsWith' || operator === 'notStartsWith') {
						formattedValue = `${value}%`;
					} else if (operator === 'endsWith' || operator === 'notEndsWith') {
						formattedValue = `%${value}`;
					} else if (operator === 'contains' || operator === 'notContains') {
						formattedValue = `%${value}%`;
					}

					values.push(formattedValue);
					clauseParts.push(
						`${fieldName} ${sqlOperator} $${paramIndex.current++}`
					);
				}
			}
		} else {
			// Handle direct value (e.g., { age: 25 } -> "age = $1")
			values.push(condition);
			clauseParts.push(`${fieldName} = $${paramIndex.current++}`);
		}
	};

	for (const [key, condition] of Object.entries(whereClause || {})) {
		if (key === 'OR' && Array.isArray(condition)) {
			// Handle "OR" conditions
			const orParts = condition.map((subCondition: TWhereCondition<T>) => {
				const { clause, values: nestedValues } = buildWhereClause({
					whereClause: subCondition,
					parentTableName,
					parentAlias,
					paramIndex,
					aliasMap,
				});
				values.push(...nestedValues);
				return `(${clause})`;
			});
			clauseParts.push(`(${orParts.join(' OR ')})`);
		} else if (key === 'includes' && typeof condition === 'object') {
			// Skip includes since it's handled in buildJoinClause
		} else {
			// Collect parts from parseCondition to include all subconditions
			parseCondition(key, condition);
		}
	}

	const clause = clauseParts.filter(Boolean).join(' AND ');
	return { clause, values };
};
