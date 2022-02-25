import { IPost } from '@dal/Post';

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  posts?: IPost[];
  totalPosts?: number;
}
