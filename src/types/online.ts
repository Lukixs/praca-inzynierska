export type Player = "white" | "black";

export interface onlineRoom {
  id: string;
  name: string;
  players: onlinePlayer[];
}

export interface onlinePlayer {
  name: string;
  id: string;
  color: string;
}
