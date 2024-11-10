import type { Pool } from 'pg';
import { typeEntries } from '../../../utils/typedEntries.js';
import {
	buildJoinClause,
	type TBuildJoinClauseReturn,
} from '../../queryBuilder/utils/buildJoinClause.js';
import { buildSelectClause } from '../../queryBuilder/utils/buildSelectClause.js';
import {
	buildWhereClause,
	type TBuildWhereClauseReturn,
} from '../../queryBuilder/utils/buildWhereClause.js';

export class BaseRepository<T extends TEntity> {
	protected baseName: string;

	constructor(
		protected pool: Pool,
		protected tableName: string,
		protected alias: string
	) {
		this.pool = pool;
		this.tableName = `public.${tableName}`;
		this.baseName = tableName;
		this.alias = alias;
	}

	async findAll(options?: TFindManyOptions<T>): Promise<TQueryResult<T>> {
		const aliasMap = { root: this.alias };

		const joinResult = buildJoinClause({
			include: options?.include,
			parentTableName: this.baseName,
			parentAlias: aliasMap.root,
			aliasIndex: { current: 1 },
			aliasMap,
		});

		const allAlias = { ...joinResult.aliasMap, ...aliasMap };

		const whereResult = buildWhereClause({
			whereClause: options?.where,
			parentTableName: this.baseName,
			parentAlias: this.alias,
			paramIndex: joinResult.aliasIndex,
			aliasMap: allAlias,
		});

		const selectResult = buildSelectClause({
			select: options?.select,
			alias: this.alias,
			aliasMap: allAlias,
			parentAlias: this.alias,
		});

		return await this.privateQuery({
			query: `SELECT ${selectResult} 
FROM ${this.tableName} AS ${this.alias}`,
			whereClause: whereResult,
			joinClause: joinResult,
			include: options?.include,
		});
	}

	protected async privateQuery<T extends TEntity>(p: {
		query: string;
		whereClause?: TBuildWhereClauseReturn;
		joinClause?: TBuildJoinClauseReturn;
		include?: TIncludes<T>;
	}): Promise<TQueryResult<T>> {
		const fullQuery = `${p.query} 
${p.joinClause?.joinClause ?? ''}
${p.whereClause?.clause ? `WHERE ${p.whereClause.clause}` : ''}`;

		const finalValues = [
			...(p.joinClause?.values ?? []),
			...(p.whereClause?.values ?? []),
		];

		console.log(fullQuery, finalValues);

		const startedAt = performance.now();
		const result = await this.pool.query(fullQuery, finalValues);
		const rows = result.rows as T[];
		const endedAt = performance.now();

		const elapsedTime = endedAt - startedAt;

		const newRows: TRow<T>[] = [];
		for (const [rowIndex, row] of rows.entries()) {
			const newRow: TRow<T> = { data: {}, index: rowIndex };

			for (const [fieldName, value] of typeEntries(row)) {
				newRow.data[fieldName as keyof T] = value as T[keyof T];
			}

			newRows.push(newRow);
		}

		return {
			query: fullQuery,
			rowCount: rows.length,
			rows: newRows,
			elapsedTime,
		};
	}
}
