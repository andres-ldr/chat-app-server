enum MSG_TYPE {
  FILE,
  IMG,
  LINK,
  TEXT,
  AUDIO,
}

export interface MsgEntity {
  type: MSG_TYPE;
  content: string;
  date: string;
  sender: number[];
}
