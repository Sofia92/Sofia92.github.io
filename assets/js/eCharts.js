
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
var option;

async function loadData() {
    const response = await fetch('./result-tree.json');
    if (!response.ok) {
        throw new Error('文档加载失败');
    }
    return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main').style.width = document.body.clientWidth + 'px';
    document.getElementById('main').style.height = Math.max(400, document.body.clientHeight) + 'px';

    loadData().then(data => {
        const treemapOption = {
            series: [
                {
                    type: 'treemap',
                    data: data.children,
                    nodeClick: false,
                    leafDepth: 1,
                    label: {
                        show: true
                    },
                    breadcrumb: {
                        show: true
                    },
                    itemStyle: {
                        borderRadius: 4,
                        gapWidth: 12,
                    },
                    scaleLimit: {
                        min: 40,
                        max: 80
                    }
                }
            ]
        };


        myChart.setOption(treemapOption);

        myChart.resize();

        myChart.on('click', function (params) {
            // 控制台打印数据的名称
            const { link, category } = params.data;
            if (link) {
                window.open(link, '_blank');
                return;
            }
            if (!link && category) {
                window.open(`${location.origin}/docs/index?category=${category}`, '_blank');
                return;
            }
        });
    })
})
