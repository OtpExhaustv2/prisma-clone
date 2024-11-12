import 'dotenv/config';
import express from 'express';
import { db } from './features/database/index.js';

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

app.get('/schema', async (req, res) => {});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
