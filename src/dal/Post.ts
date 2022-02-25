import { IUser } from '@dal/User';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: IUser;
}
