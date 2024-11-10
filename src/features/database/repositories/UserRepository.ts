import type { Pool } from 'pg';
import { BaseRepository } from './BaseRepository.js';

export class UserRepository extends BaseRepository<TUser> {
	constructor(pool: Pool) {
		super(pool, 'User', 'u');
	}
}
