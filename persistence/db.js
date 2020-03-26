import config from '../config/config.js'
const neo4j = require('neo4j-driver')

const driver = neo4j.driver(config.dbUri);

function recordsToTree(records) {
    const idToValue = new Map();
    let root;

    records.forEach(record => {
        let parent = record.get('parent');
        const parentId = JSON.stringify(parent.identity);
        const relation = record.get('relation');
        let child = record.get('child');
        const childId = JSON.stringify(child.identity);
        parent = idToValue.get(parentId) ?? { ...parent, children: [] };
        child = idToValue.get(childId) ?? { ...child , children: []};
        const children = parent['children'];
        const edgeValue = relation.properties.name ?? '';
        children.push({...child, pathValue: edgeValue})
        parent['children'] = children;
        idToValue.set(parentId, parent);
        idToValue.set(childId, child);
        if (parent.labels.includes('Root')) {
            root = parent;
        }
    });
    return root;
}

export default async function getAll() {
    const session = driver.session()
    try {
        const result = await session.run(
            'match(parent)-[relation]->(child) return parent,relation,child'
        )
        return recordsToTree(result.records);
    } finally {
        await session.close()
    }
}