type SQLComparisonOperator =
	| '='
	| '>'
	| '<'
	| '>='
	| '<='
	| '<>'
	| '!='
	| 'LIKE'
	| 'ILIKE'
	| 'IN'
	| 'NOT IN';

type WhereCondition<T> = {
	[K in keyof T]?:
		| T[K]
		| { operator: SQLComparisonOperator; value: T[K] | T[K][] }
		| WhereCondition<T[K]>
		| WhereCondition<T[K]>[];
};
