import type { Pool } from 'pg';
import { BaseRepository } from './BaseRepository.js';

export class PostRepository extends BaseRepository<TPost> {
	constructor(pool: Pool) {
		super(pool, 'Post', 'p');
	}
}
