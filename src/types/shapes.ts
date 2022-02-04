import { Coordinates } from "./board";

export interface dropShapes {
  value?: number;
  position: Coordinates;
}

export interface strengthCoordinate {
  coordinate: Coordinates;
  strength: number;
}
