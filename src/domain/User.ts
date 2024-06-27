export interface UserEntity {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string | null;
  creationDate: Date;
}
