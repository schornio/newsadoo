import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export interface LinkMesh extends SimulationLinkDatum {
  id?: string | number;
  source: NodeMesh | number;
  target: NodeMesh | number;
  weight: number;
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
  image: string;
  z?: number;
  index?: number;
  x?: number;
  y?: number;
  vy?: number;
  vx?: number;
}

/* 
{
    "source": {
        "id": 80436,
        "name": "Haas F1 Team",
        "tag_timeline": "https://newsadoo.com/de/tag/80436/timeline",
        "tag_type": "UNKNOWN",
        "val": 1796,
        "level": 0,
        "image": "https://media.newsadoo.com/mediahub/datasphere/vr/placeholder.png",
        "z": 368.54492542842786,
        "index": 19,
        "x": 69.40407137416089,
        "y": -135.64475848812418,
        "vy": -0.005779535676902108,
        "vx": 0.014632178457326988
    },
    "target": {
        "id": 69680,
        "name": "Nico Hülkenberg",
        "tag_timeline": "https://newsadoo.com/de/tag/69680/timeline",
        "tag_type": "PER",
        "val": 1971,
        "level": 0,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg/100px-2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg",
        "z": 792.6035207014619,
        "index": 9,
        "x": 148.02074122234612,
        "y": -56.25451361791475,
        "vy": -0.007317787764343194,
        "vx": 0.016250489078261845
    },
    "weight": 0.8100064715652499,
    "root": 80436,
    "index": 460
}

*/
