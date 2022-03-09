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

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class Graph {
    private adjacencyList: Map<string, Edge[]>;

    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex: string) {
        this.adjacencyList.set(vertex, []);
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
}

export default Graph;
