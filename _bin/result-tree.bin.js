const fs = require('fs');
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function transform(sourceJSONPath) {
    const file = fs.readFileSync(sourceJSONPath, 'utf-8');
    const data = JSON.parse(file);
    const firstNode = { id: "Frontend", label: "Frontend", name: "Frontend", value: 100, children: [] };
    data.forEach(item => {
        firstNode.children.push({
            id: item.category,
            label: item.title,
            name: item.title,
            link: item.link || null,
            category: item.category, value: 80,
            children: item.items.map(_item => ({ id: generateUUID(), label: _item.text, name: _item.text, link: _item.link || null, value: 40, category: item.category }))
        })
    });
    return firstNode;
}

const result = transform('./source.json');
fs.writeFileSync('./result-tree.json', JSON.stringify(result), 'utf-8')
