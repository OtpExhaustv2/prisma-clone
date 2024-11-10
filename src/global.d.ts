type TRow<T extends TEntity> = {
	data: {
		[P in keyof T]?: T[P];
	};
	index?: number;
};

type TQueryResult<T extends TEntity> = {
	rows: TRow<T>[];
	rowCount: number;
	query: string;
	elapsedTime: number;
};

type TEntity = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

type TPost = {
	id: number;
	title: string;
	userId: number;
	content: string;
	comments: TComment[];
	user: TUser;
} & TEntity;

type TComment = {
	id: number;
	content: string;
	userId: number;
	postId: number;
	post: TPost;
} & TEntity;

type TUser = {
	id: number;
	username: string;
	email: string;
	posts: TPost[];
} & TEntity;
