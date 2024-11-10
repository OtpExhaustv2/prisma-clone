import { typeEntries } from '../../../utils/typedEntries.js';
import { getColumnWithAlias } from './generateAlias.js';

export type TBuildSelectClauseReturn = string;

export const buildSelectClause = <T extends TEntity>(p: {
	select: TSelect<T> | undefined;
	alias?: string;
	parentAlias?: string;
	aliasMap: Record<string, string>;
}): TBuildSelectClauseReturn => {
	const { select, alias, aliasMap, parentAlias } = p;
	const mainAlias = alias || parentAlias || aliasMap.root;

	const wildcard = getColumnWithAlias('*', alias);

	if (!select) {
		return wildcard;
	}

	const selectedColumns: string[] = [];

	for (const [column, value] of typeEntries(select)) {
		const columnAlias = aliasMap[column] || mainAlias;

		if (typeof value === 'boolean' && value) {
			if (columnAlias !== mainAlias) {
				selectedColumns.push(getColumnWithAlias('*', columnAlias));
			} else {
				selectedColumns.push(getColumnWithAlias(column, mainAlias));
			}
		} else if (typeof value === 'object') {
			const nestedSelect = buildSelectClause({
				select: value,
				aliasMap,
				parentAlias: columnAlias,
			});
			selectedColumns.push(nestedSelect);
		}
	}

	return selectedColumns.length > 0 ? selectedColumns.join(', ') : wildcard;
};
