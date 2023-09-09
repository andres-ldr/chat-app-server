export interface UserEntity {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  //contacts: [];
  profileImage: string | null;
  //chats: [];
  creationDate: Date;
}
