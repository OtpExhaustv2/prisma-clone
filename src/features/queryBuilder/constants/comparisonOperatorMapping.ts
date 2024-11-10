export const comparisonOperatorMapping: Record<
	TSQLComparisonOperatorAbbreviated,
	TSQLComparisonOperator
> = {
	eq: '=',
	gt: '>',
	lt: '<',
	gte: '>=',
	lte: '<=',
	ne: '<>',
	in: 'IN',
	notIn: 'NOT IN',
	like: 'LIKE',
	notLike: 'NOT LIKE',
	startsWith: 'LIKE',
	notStartsWith: 'NOT LIKE',
	contains: 'LIKE',
	notContains: 'NOT LIKE',
	endsWith: 'LIKE',
	notEndsWith: 'NOT LIKE',
	mode: '',
};
