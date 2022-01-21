import { Coordinates } from "./board";

export interface dropShapes {
  value?: number;
  position: Coordinates;
}

export interface strenghtCoordinate {
  coordinate: Coordinates;
  strength: number;
}
