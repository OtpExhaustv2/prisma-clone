export const retrieveFormattedArgs = (args: string[]): Record<string, string> =>
	Object.fromEntries(
		args.map((arg) => {
			const [key, value] = arg.split(':').map((str) => str.trim());
			return [key, value.replace(/[\[\]]/g, '')];
		})
	);
