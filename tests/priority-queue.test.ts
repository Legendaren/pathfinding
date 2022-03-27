import PriorityQueue from "../src/Pathfinding/priority-queue/priority-queue";

describe("Priority Queue functionality", () => {
    let pq: PriorityQueue;

    beforeEach(() => {
        pq = new PriorityQueue();
    });

    it("Should be empty at start", () => {
        expect(pq.isEmpty()).toBeTruthy();
        expect(pq.size()).toBe(0);
    });

    it("Should contain the most recent element when popped, 1 element", () => {
        const vertex = { name: "vert1", cost: 1 };
        pq.push(vertex);
        expect(pq.size()).toBe(1);
        expect(pq.isEmpty()).toBeFalsy();

        const poppedVertex = pq.pop();
        expect(poppedVertex).toEqual(vertex);
        expect(pq.size()).toBe(0);
        expect(pq.isEmpty()).toBeTruthy();
    });

    it("Should contain the smallest element when popped, 2 elements", () => {
        const v1 = { name: "vert1", cost: 10 };
        const v2 = { name: "vert2", cost: 3 };

        pq.push(v1, v2);
        expect(pq.size()).toBe(2);
        expect(pq.isEmpty()).toBeFalsy();

        const poppedVertex = pq.pop();
        expect(poppedVertex).toEqual(v2);
        expect(pq.size()).toBe(1);
        expect(pq.isEmpty()).toBeFalsy();
    });

    it("Should contain the smallest element when popped, 3 elements", () => {
        const v1 = { name: "vert1", cost: 5 };
        const v2 = { name: "vert2", cost: 3 };
        const v3 = { name: "vert3", cost: 10 };

        pq.push(v1, v2, v3);
        expect(pq.size()).toBe(3);
        expect(pq.isEmpty()).toBeFalsy();

        const poppedVertex = pq.pop();
        expect(poppedVertex).toEqual(v2);
        expect(pq.size()).toBe(2);
        expect(pq.isEmpty()).toBeFalsy();
    });

    it("Should return the smallest element at peek", () => {
        const v1 = { name: "vert1", cost: 5 };
        const v2 = { name: "vert2", cost: 3 };
        const v3 = { name: "vert3", cost: 10 };

        pq.push(v1, v2, v3);
        const poppedVertex = pq.peek();
        expect(poppedVertex).toEqual(v2);
    });

    it("Should keep the same size when calling peek", () => {
        const v1 = { name: "vert1", cost: 5 };
        const v2 = { name: "vert2", cost: 3 };
        const v3 = { name: "vert3", cost: 10 };

        pq.push(v1, v2, v3);
        expect(pq.size()).toEqual(3);
        pq.peek();
        expect(pq.size()).toEqual(3);
    });
});
