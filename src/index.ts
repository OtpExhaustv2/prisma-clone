import 'dotenv/config';
import express from 'express';
import { db } from './features/database/index.js';
import { generateSQL } from './features/schema-parser/generateSQL.js';
import { parse } from './features/schema-parser/parse.js';
import { tokenize } from './features/schema-parser/tokenize.js';
import { validateSchema } from './features/schema-parser/validateSchema.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
	const a = await db.user.findAll({
		select: {
			id: true,
			email: true,
			posts: {
				userId: true,
			},
		},
		include: {
			posts: {
				where: {
					content: {
						contains: 'dictumst',
					},
				},
			},
		},
		where: {
			id: 490,
		},
	});

	res.json(a);

	// const b = await db.post.findAll({
	// 	select: {
	// 		id: true,
	// 		user: true,
	// 	},
	// 	include: {
	// 		user: true,
	// 	},
	// });

	// res.json(b);
});

app.get('/schema', async (req, res) => {
	const schema = `
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
`;

	const tokens = tokenize(schema);

	const result = parse(tokens);

	try {
		validateSchema(result);

		res.json(generateSQL(result));
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
