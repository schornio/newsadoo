// src/utils/graph.js

import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";

// Constants
export const NODE_SIZE_KEY = "normalizedVal";
export const LINK_SIZE_KEY = "normalizedWeight";
export const MAX_FONT = 12;
export const MIN_FONT = 5;

// Color Conversion Functions
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hslToRGBHex(h, s, l) {
  let r, g, b;
  [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Utility Functions
function normalizeValue(val, min, max) {
  return (val - min) / (max - min);
}

// Data Formatting Functions
export function normalizeNodeSize(data, lower = 2, upper = 10) {
  let values = data.nodes.map((node) => node.val);
  let min = Math.min(...values);
  let max = Math.max(...values);

  let diff = upper - lower;

  data.nodes.forEach((node) => {
    node[NODE_SIZE_KEY] = lower + normalizeValue(node.val, min, max) * diff;
  });
  return data;
}

export function normalizeLinkSize(data, lower = 0.5, upper = 5) {
  let weights = data.links.map((link) => link.weight);
  let min = Math.min(...weights);
  let max = Math.max(...weights);

  let diff = upper - lower;

  data.links.forEach(
    (link) =>
      (link[LINK_SIZE_KEY] =
        lower + normalizeValue(link.weight, min, max) * diff)
  );
  return data;
}

export function setNodeColor(data) {
  const node_map = new Map();
  data.nodes.forEach((n) => {
    n.H = -1.0;
    n.S = 1.0 / 2 ** n.level;
    n.L = 0.5;
    node_map.set(n.id, n);
  });

  const root_nodes = data.nodes.filter((node) => node.level === 0);
  const H_step = 1.0 / root_nodes.length;
  root_nodes.forEach((n, i) => {
    n.H = 0.0 + H_step * i; // Init hue value for root nodes
  });

  // Stores a map of { node: [ edges-that-link to this-node ] }
  let cur_nodes = new Map();
  let nxt_nodes = new Map();

  root_nodes.forEach((n) => {
    data.links
      .filter((e) => e.source === n.id)
      .forEach((e) => {
        if (!nxt_nodes.has(e.target)) {
          nxt_nodes.set(e.target, []);
        }
        nxt_nodes.get(e.target).push(e);
        e.H = n.H;
        e.S = n.S;
        e.L = n.L;
      });
  });

  const levels = Math.max(...data.nodes.map((n) => n.level));

  for (let i = 1; i <= levels; i += 1) {
    cur_nodes = nxt_nodes;
    nxt_nodes = new Map();

    cur_nodes.forEach((edges, node_id) => {
      let node = node_map.get(node_id);
      if (node.level === i) {
        // Propagate hue + greyness from parent
        node.H = node_map.get(edges[0].source).H;
        node.S = edges[0].S / 2;

        // Check if greyness needs to be added from this node on
        if (edges.length > 1) {
          // check if greyness needs to be added from this node on
          if (
            !edges
              .map((e) => node_map.get(e.source).H)
              .every((v, i, a) => v === a[0])
          ) {
            node.S = 0.0;
          }
        }

        // Add child-nodes
        data.links
          .filter((e) => e.source === node.id)
          .forEach((e) => {
            e.H = node.H;
            e.S = node.S;
            e.L = node.L;
            let other = node_map.get(e.target);
            if (other.level === node.level + 1) {
              if (!nxt_nodes.has(other.id)) {
                nxt_nodes.set(other.id, []);
              }
              nxt_nodes.get(other.id).push(e);
            }
          });
      }
    });
  }

  data.nodes.forEach((n) => (n.color = hslToRGBHex(n.H, n.S, n.L)));
  data.links.forEach((e) => (e.color = hslToRGBHex(e.H, e.S, e.L)));
  return data;
}

// Graph Loading Function
export function loadGraph(element, data, textMode) {
  let Graph = ForceGraph3D()(element)
    .nodeVal(NODE_SIZE_KEY)
    .linkDirectionalParticles(LINK_SIZE_KEY)
    .linkCurvature(0.1)
    .linkDirectionalParticleWidth(LINK_SIZE_KEY)
    .graphData(data);

  if (textMode) {
    const levels = Math.max(...data.nodes.map((n) => n.level));
    const perLevel = (MAX_FONT - MIN_FONT) / levels;
    Graph = Graph.nodeThreeObject((node) => {
      const sprite = new SpriteText(node.name);
      sprite.material.depthWrite = false; // make sprite background transparent
      sprite.color = node.color;
      sprite.textHeight = MAX_FONT - perLevel * node.level;
      return sprite;
    });
  }

  return Graph;
}

// File Loading Function
export function loadFile(file, textMode, onError) {
  return file
    .text()
    .then((content) => JSON.parse(content))
    .then((data) => normalizeNodeSize(data))
    .then((data) => normalizeLinkSize(data))
    .then((data) => setNodeColor(data))
    .then((data) =>
      loadGraph(document.getElementById("3d-graph"), data, textMode)
    )
    .catch((error) => {
      console.error("Error loading file:", error);
      if (onError) onError(error);
    });
}
