export const relationshipMapping: TRelationshipMapping = {
	User: { posts: { from: 'id', to: 'userId', targetTable: 'Post' } },
	Post: {
		user: { from: 'userId', to: 'id', targetTable: 'User' },
		comments: { from: 'id', to: 'postId', targetTable: 'Comment' },
	},
	Comment: { post: { from: 'postId', to: 'id', targetTable: 'Post' } },
};
