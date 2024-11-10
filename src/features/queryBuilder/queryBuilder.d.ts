type TSQLCommonComparisonOperatorAbbreviated =
	| 'eq'
	| 'gt'
	| 'lt'
	| 'gte'
	| 'lte'
	| 'ne'
	| 'in'
	| 'notIn';

type TSQLStringComparisonOperatorAbbreviated =
	| TSQLCommonComparisonOperatorAbbreviated
	| 'mode'
	| 'notLike'
	| 'like'
	| 'startsWith'
	| 'notStartsWith'
	| 'contains'
	| 'notContains'
	| 'endsWith'
	| 'notEndsWith';

type TSQLComparisonOperatorAbbreviated =
	| TSQLCommonComparisonOperatorAbbreviated
	| TSQLStringComparisonOperatorAbbreviated;

type TSQLComparisonOperator =
	| ''
	| '='
	| '>'
	| '<'
	| '>='
	| '<='
	| '<>'
	| 'NOT LIKE'
	| 'LIKE'
	| 'IN'
	| 'NOT IN';

type TOperatorCondition<T extends TEntity, K extends keyof T> = {
	[Comparator in T[K] extends string
		? TSQLStringComparisonOperatorAbbreviated
		: TSQLCommonComparisonOperatorAbbreviated]?: Comparator extends
		| 'in'
		| 'notIn'
		? T[K][]
		: Comparator extends 'mode'
		? 'insensitive' | 'default'
		: T[K];
};

type TWhereCondition<T extends TEntity> = {
	[K in keyof T]?: T[K] | TOperatorCondition<T, K> | WhereCondition<T[K]>;
} & {
	OR?: TWhereCondition<T>[];
};

type TWhereOption<T extends TEntity> = {
	where?: TWhereCondition<T>;
};

type TRelationKeys<T extends TEntity> = {
	[K in keyof T]: T[K] extends (infer U)[] | infer U ? K : never;
}[keyof T];

type TExctractArrayType<T extends TEntity> = T extends (infer U)[] ? U : T;

type TIncludes<T extends TEntity> = {
	[K in TRelationKeys<T>]?:
		| true
		| {
				where?: TWhereCondition<TExctractArrayType<T[K]>>;
				include?: TIncludes<TExctractArrayType<T[K]>>;
		  };
};

type TIncludeOption<T extends TEntity> = {
	include?: TIncludes<T>;
};

type TSelect<T extends TEntity> = {
	[K in keyof T]?: K extends TRelationKeys<T>
		? boolean | TSelect<TExctractArrayType<T[K]>>
		: boolean;
};

type TSelectOption<T extends TEntity> = {
	select?: TSelect<T>;
};

type TFindManyOptions<T extends TEntity> = TWhereOption<T> &
	TIncludeOption<T> &
	TSelectOption<T>;

type TWhereClauseKey<T extends TEntity> =
	| keyof T
	| 'OR'
	| TSQLComparisonOperatorAbbreviated;

type TRelationshipMapping = Record<
	string,
	Record<string, { from: string; to: string; targetTable: string }>
>;
