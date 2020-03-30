export class NodeForClient {
    constructor({identity, labels, properties}) {
        this.labels = labels;
        this.properties = properties;
        this.id = identity.low;
    }
}

export class EdgeForClient {
    constructor({identity, start, end, type, properties}) {
        this.properties = properties;
        this.id = identity.low;
        this.start = start.low;
        this.end = end.low;
        this.type = type;
    }
}