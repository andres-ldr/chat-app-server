export enum MSG_TYPE {
  FILE,
  IMG,
  LINK,
  TEXT,
  AUDIO,
}

export interface MsgEntity {
  type: MSG_TYPE;
  content: string;
  sender: string;
}
