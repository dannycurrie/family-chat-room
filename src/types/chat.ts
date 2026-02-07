export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  type: "message";
}

export interface SystemMessage {
  id: string;
  text: string;
  timestamp: number;
  type: "system";
}

export type DisplayMessage = ChatMessage | SystemMessage;

export interface User {
  id: string;
  username: string;
}

// Client → Server events
export interface SendMessageEvent {
  event: "message";
  text: string;
}

export type ClientEvent = SendMessageEvent;

// Server → Client events
export interface UserJoinedEvent {
  event: "user-joined";
  username: string;
}

export interface UserLeftEvent {
  event: "user-left";
  username: string;
}

export interface MessageEvent {
  event: "message";
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface UsersListEvent {
  event: "users-list";
  users: string[];
}

export type ServerEvent =
  | UserJoinedEvent
  | UserLeftEvent
  | MessageEvent
  | UsersListEvent;
