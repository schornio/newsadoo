import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export type Position = {
  x: number;
  y: number;
  z: number;
};

export interface LinkMesh extends SimulationLinkDatum {
  source: Position;
  target: Position;
  weight: number;
  // added after d3 simulation
  id?: string | number;
}

/**
 * PER = Person | ORG = Organization | LOC = Location
 */
export type TagEnum = "PER" | "ORG" | "LOC" | "EVENT" | "UNKNOWN";

export interface NodeMesh extends SimulationNodeDatum {
  id: number;
  name: string;
  tag_timeline: string;
  tag_type: string;
  val: number;
  level: number;
  image: string;
  // added after d3 simulation
  z?: number;
  index?: number;
  x?: number;
  y?: number;
  vy?: number;
  vx?: number;
}
