export interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
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

export interface ChangeAvatarEvent {
  event: "change-avatar";
  avatar: string;
}

export type ClientEvent = SendMessageEvent | ChangeAvatarEvent;

// Server → Client events
export interface UserJoinedEvent {
  event: "user-joined";
  username: string;
  avatar: string;
}

export interface UserLeftEvent {
  event: "user-left";
  username: string;
  avatar: string;
}

export interface MessageEvent {
  event: "message";
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
}

export interface UsersListEvent {
  event: "users-list";
  users: { username: string; avatar: string }[];
}

export type ServerEvent =
  | UserJoinedEvent
  | UserLeftEvent
  | MessageEvent
  | UsersListEvent;
