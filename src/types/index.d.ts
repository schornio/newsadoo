export type LinkMesh = {
  source: NodeMesh | number;
  target: NodeMesh | number;
  weight: number;
  normalizedWeight: number;
  color: string;
};

export type NodeMesh = {
  id: number;
  name: string;
  val: number;
  level: number;
  normalizedVal: number;
  color: string;
  position: [number, number, number];
};
