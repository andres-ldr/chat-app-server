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
  profileImage?: string | null;
  // user: string;
  // author: string;
}
// contactId: string; email: string; authorId: string; alias: string; profileImage: string | null; } | null
