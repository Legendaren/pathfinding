import { GridPosition } from "../grid";

export interface DistanceVertex {
    position: GridPosition;
    weight: number;
    previous?: DistanceVertex;
}

export class Edge {
    private from: string;
    private to: string;
    private weight: number;

    constructor(from: string, to: string, weight: number) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    getWeight() {
        return this.weight;
    }
}

export class Vertex {
    private name: string;
    private position: GridPosition;

    constructor(name: string, position: GridPosition) {
        this.name = name;
        this.position = position;
    }

    getName() {
        return this.name;
    }

    getPosition() {
        return this.position;
    }
}

class Graph {
    private adjacencyList: Map<string, Edge[]>;
    private vertices: Map<string, Vertex>;

    constructor() {
        this.adjacencyList = new Map();
        this.vertices = new Map();
    }

    addVertex(vertex: Vertex) {
        this.adjacencyList.set(vertex.getName(), []);
        this.vertices.set(vertex.getName(), vertex);
    }

    addEdge(vertex: string, edge: Edge) {
        const edgeList = this.adjacencyList.get(vertex);
        if (!edgeList) {
            throw new Error(`Vertex ${vertex} not present in graph.`);
        }
        edgeList.push(edge);
    }

    getEdges(vertex: string): Edge[] {
        return this.adjacencyList.get(vertex) || [];
    }

    getVertices(): string[] {
        return Array.from(this.adjacencyList.keys());
    }

    getVertex(vertexName: string): Vertex | undefined {
        return this.vertices.get(vertexName);
    }
}

export default Graph;
