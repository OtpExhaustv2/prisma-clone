export const relationshipMapping: TRelationshipMapping = {
  "User": {
    "posts": {
      "from": "id",
      "to": "authorId",
      "targetTable": "Post"
    }
  },
  "Post": {
    "author": {
      "from": "authorId",
      "to": "id",
      "targetTable": "User"
    },
    "comments": {
      "from": "id",
      "to": "postId",
      "targetTable": "Comment"
    }
  },
  "Comment": {
    "post": {
      "from": "postId",
      "to": "id",
      "targetTable": "Post"
    }
  }
};