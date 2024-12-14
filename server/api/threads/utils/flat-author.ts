type NestAuthor = {
  account: {
    id: number;
  };
  name: string;
  bio: string;
};
type FlatAuthor = {
  id: number;
  name: string;
  bio: string;
};
export function flatAuthor(author: NestAuthor): FlatAuthor {
  return {
    id: author.account.id,
    name: author.name,
    bio: author.bio,
  };
}
