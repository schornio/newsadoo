import { animated, useSpring } from "@react-spring/three";
// import { Text } from "@react-three/drei";
import { toPosition } from "../utils/toPosition";
import { NodeMesh } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./default/card";
import { Text } from "@react-three/uikit";

/* 
{
    "id": 78503,
    "name": "Lando Norris",
    "tag_timeline": "https://newsadoo.com/de/tag/78503/timeline",
    "tag_type": "PER",
    "val": 2960,
    "level": 0,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg"
}
*/

/**
 * Not sure if we we will use ui kit for the nodes. It interferes heavily with the position of the elements and it doesn't accept animation
 * In case we do use it, remember to wrap any and all elements of UI Kit with <Root>
 */
export function NodeUIKit({
  node,
  onClick,
  position,
}: {
  node: NodeMesh;
  onClick?: () => void;
  position: [number, number, number];
}) {
  // const [showText, setShowText] = useState(false);

  return (
    <Card width={380} positionTop={100}>
      <CardHeader>
        <CardTitle>
          <Text>{node.name}</Text>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>{node.val}</CardDescription>
        <CardDescription>{node.tag_timeline}</CardDescription>
        <CardDescription>{node.tag_type}</CardDescription>
      </CardContent>
    </Card>
  );
}
