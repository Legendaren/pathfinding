interface PQVertex {
    name: string;
    cost: number;
}

class PriorityQueue {
    private readonly top = 0;
    private readonly parent = (i: number) => ((i + 1) >>> 1) - 1;
    private readonly left = (i: number) => (i << 1) + 1;
    private readonly right = (i: number) => (i + 1) << 1;

    private _heap: PQVertex[];
    private _comparator: (a: PQVertex, b: PQVertex) => boolean;

    constructor(comparator = (a: PQVertex, b: PQVertex) => a.cost <= b.cost) {
        this._heap = [];
        this._comparator = comparator;
    }

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    peek() {
        return this._heap[this.top];
    }

    push(...values: PQVertex[]) {
        values.forEach((value) => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top) {
            this._swap(this.top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    replace(value: PQVertex) {
        const replacedValue = this.peek();
        this._heap[this.top] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i: number, j: number) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i: number, j: number) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this._greater(node, this.parent(node))) {
            this._swap(node, this.parent(node));
            node = this.parent(node);
        }
    }

    _siftDown() {
        let node = this.top;
        while (
            (this.left(node) < this.size() &&
                this._greater(this.left(node), node)) ||
            (this.right(node) < this.size() &&
                this._greater(this.right(node), node))
        ) {
            let maxChild =
                this.right(node) < this.size() &&
                this._greater(this.right(node), this.left(node))
                    ? this.right(node)
                    : this.left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

export default PriorityQueue;
