export type User = {
  id: number;
  name: string;
  email: string;
  posts: Post[];
};

export type Post = {
  id: number;
  title: string;
  content: string;
  author: User;
  authorId: number;
  comments: Comment[];
};

export type Comment = {
  id: number;
  content: string;
  postId: number;
  post: Post;
};