import pg from 'pg';
import { PostRepository } from './repositories/PostRepository.js';
import { UserRepository } from './repositories/UserRepository.js';

export class Database {
	private pool: pg.Pool;
	public user: UserRepository;
	public post: PostRepository;

	constructor() {
		this.pool = new pg.Pool({
			user: 'postgres',
			password: 'root',
			host: 'localhost',
			port: 5432,
			database: 'macha',
		});
		this.pool.connect();
		this.pool.on('error', (err) => {
			console.error('Unexpected error on idle client', err);
		});

		this.user = new UserRepository(this.pool);
		this.post = new PostRepository(this.pool);
	}
}

export const db = new Database();
