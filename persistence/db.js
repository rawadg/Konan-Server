import config from '../config/config.js'
import { NodeForClient, EdgeForClient } from './client-types.js';
const neo4j = require('neo4j-driver')

const driver = neo4j.driver(config.dbUri);

function recordsToGraph(records) {
    let [[nodes, edges]] = records.map(record => [record.get('nodes'), record.get('edges')])
    nodes = nodes.map(node => new NodeForClient(node));
    edges = edges.map(edge => new EdgeForClient(edge));
    return { nodes: nodes, edges: edges };
}

export async function getFullGraph() {
    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH path = (r: Root) -[*0..]->(n)
            WITH relationships(path) as edges, n as n
            UNWIND (CASE edges WHEN [] then [null] else edges end) as edge
            RETURN collect(DISTINCT edge) as edges, collect(DISTINCT n) as nodes`
        )
        return recordsToGraph(result.records);
    } finally {
        await session.close()
    }
}

export async function getSubGraph(rootId) {
    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH path = (r) -[*0..]->(n)
            WHERE ID(r)=${rootId}
            WITH relationships(path) as edges, n as n
            UNWIND (CASE edges WHEN [] then [null] else edges end) as edge
            RETURN collect(DISTINCT edge) as edges, collect(DISTINCT n) as nodes`
        )
        return recordsToGraph(result.records);
    } finally {
        await session.close()
    }
}