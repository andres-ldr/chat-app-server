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
  content?: string;
  // file: string;
  type: string;
  creationDate: Date;
  senderId: string;
}

export interface Message {
  mid: string;
  chatId: string;
  content: string | null;
  file: string | null;
  type: string;
  creationDate: Date;
  senderId: string;
}
