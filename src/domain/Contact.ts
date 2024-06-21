import { UserEntity } from './User';

export default interface ContactEntity {
  contactId: string;
  userId: string;
  authorId: string;
  alias: string;
  email: string;
  creationDate: Date;
}
