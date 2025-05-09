async function loadData() {
    const response = await fetch('./result-tree.json');
    if (!response.ok) {
        throw new Error('文档加载失败');
    }
    return await response.json();
}

const calcStrLen = str => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
};

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}
const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 500;

const graphDiv = document.getElementById('container');
const descriptionDiv = document.createElement('div');
descriptionDiv.innerHTML = 'Doing layout... web-worker is enabled in this demo, so the layout will not block the page.';
graphDiv.appendChild(descriptionDiv);

const graph = new G6.TreeGraph({
    container: 'container',
    width,
    height,
    pixelRatio: 12,
    modes: {
        default: ['drag-canvas', 'drag-node']
    },
    defaultEdge: {
        shape: 'cubic-horizontal',
        color: '#F6BD16'
    },
    layout: {
        type: 'dendrogram',
        preventOverlap: true,
        direction: 'H', // H / V / LR / RL / TB / BT
        nodeSep: 50,
    }
});


graph.on('afterlayout', () => {
    descriptionDiv.innerHTML = 'Done!';
});
loadData().then(data => {
    graph.node(function (node) {
        const label = node.label || node.id;
        let width = Math.max(120, getTextWidth(label, "normal 13px arial"));

        const shape = node.depth < 2 ? 'rect' : 'rect';
        return {
            label,
            shape,
            size: [width, 32],
            labelCfg: {
                positions: 'left',
                style: {
                    fontSize: 12
                }
            },
            style: {
                fill: '#ffffff',
                stroke: '#888',
            }
        };
    });

    graph.data(data);
    graph.render();
    graph.fitView();

    graph.on('node:click', evt => {
        const { item } = evt;
        const { link, category } = item.getModel();
        if (link) {
            window.open(link, '_blank');
        }
        if (!link && category) {
            window.open(`${location.origin}/docs/index?category=${category}`, '_blank');
            return;
        }
    });

})