type TTokenType =
	| 'MODEL'
	| 'BRACE_OPEN'
	| 'BRACE_CLOSE'
	| 'FIELD'
	| 'ATTRIBUTE'
	| 'WHITESPACE';
type TToken = { type: TTokenType; value: string };

type TAttribute = {
	name: string;
	args: string[];
};

type TField = {
	name: string;
	type: string;
	isArray: boolean;
	attributes: TAttribute[];
};

type TModel = {
	name: string;
	fields: TField[];
};
