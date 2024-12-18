import { RoundedBox, Image, Text } from "@react-three/drei";
import { Node as NodeType } from "./ForceGraph";

export function NodeDetail({
  node,
  position,
}: {
  node: NodeType;
  position: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[16, 8, 1]} radius={0.3}>
        <meshStandardMaterial color="white" />
      </RoundedBox>
      {node.data.image ? (
        <Image position={[-5, 0, 0.6]} scale={4.5} url={node.data.image} />
      ) : undefined}
      <Text position={[0.5, 1, 0.6]} color="black" fontSize={0.5}>
        {node.data.name}
      </Text>
      <Text
        position={[2.5, -1, 0.6]}
        fontSize={0.3} // Size of the text
        maxWidth={10} // Maximum width of the text box for word wrapping
        lineHeight={1.2} // Space between lines
        letterSpacing={0.02} // Space between letters
        textAlign="left" // Alignment of the text (left, center, right, justify)
        color="black" // Text color
        anchorX="center" // Horizontal anchor (center, left, right)
        anchorY="middle" // Vertical anchor (top, middle, bottom)
      >
        {node.data.text}
      </Text>
    </group>
  );
}
