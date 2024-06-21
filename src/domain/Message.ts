export enum MSG_TYPE {
  FILE,
  IMG,
  LINK,
  TEXT,
  AUDIO,
}

export interface MsgEntity {
  mid: string;
  chatId: string;
  content: string;
  type: string;
  creationDate: Date;
  senderId: string;
}
