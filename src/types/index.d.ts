import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export interface LinkMesh extends SimulationLinkDatum {
  source: NodeMesh | number;
  target: NodeMesh | number;
  weight: number;
  normalizedWeight: number;
  color: string;
}

/**
 * PER = Person | ORG = Organization | LOC = Location
 */
export type TagEnum = "PER" | "ORG" | "LOC" | "EVENT" | "UNKNOWN";

export interface NodeMesh extends SimulationNodeDatum {
  id: number;
  name: string;
  tag_timeline: string;
  tag_type: TagEnum;
  val: number;
  level: number;
  // normalizedVal: number; // to see if we keep it
  // color: string; // to see if we keep it
  position: [number, number, number];
  image: string;
}
