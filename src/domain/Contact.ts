export interface ContactEntity {
  contactId: string;
  userId: string;
  authorId: string;
  alias: string;
  email: string;
  creationDate: Date;
}

export interface Contact {
  contactId: string;
  email: string;
  userId: string;
  authorId: string;
  alias: string;
  creationDate: Date;
  // user: string;
  // author: string;
}
