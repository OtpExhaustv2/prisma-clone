export const tokenize = (schema: string): TToken[] => {
	const tokens: TToken[] = [];

	const tokenPatterns: [RegExp, TTokenType][] = [
		[/^model\s+([A-Za-z_][A-Za-z0-9_]*)/, 'MODEL'], // Match "model ModelName"
		[/^\{\s*/, 'BRACE_OPEN'], // Match opening brace '{'
		[/^\}\s*/, 'BRACE_CLOSE'], // Match closing brace '}'
		[/^(\w+)\s+(\w+)(\[\])?/, 'FIELD'], // Match "fieldName fieldType" with optional array notation
		[/^@(\w+)(\(([^()]*|\([^()]*\))*\))?/, 'ATTRIBUTE'], // Match "@attribute(args)" with arguments enclosed in parentheses
	];

	const lines = schema.split('\n');

	for (let line of lines) {
		line = line.trim();

		while (line.length > 0) {
			let matched = false;

			for (const [pattern, type] of tokenPatterns) {
				const match = line.match(pattern);

				if (match) {
					matched = true;
					if (type !== 'WHITESPACE') {
						tokens.push({ type, value: match[0].trim() });
					}
					line = line.slice(match[0].length).trim();
					break;
				}
			}

			if (!matched) {
				throw new Error(`Unexpected token at line: "${line}"`);
			}
		}
	}

	return tokens;
};
