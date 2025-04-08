async function loadData() {
    const response = await fetch('./result-tree.json');
    if (!response.ok) {
        throw new Error('文档加载失败');
    }
    return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('main');

    loadData().then(res => {
        res.forEach(category => {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.innerHTML = `<header data-category="${category.category}" data-link="${category.link}">${category.label}</header>`;
            wrapper.appendChild(descriptionDiv);
        });
    })

    wrapper.addEventListener('click', ($event) => {
        // 控制台打印数据的名称
        const { link, category } = $event.target.dataset;
        if (link !== 'null') {
            window.open(link, '_blank');
            return;
        }
        if (category) {
            window.location.assign(`${location.origin}/docs/index?category=${category}`);
            return;
        }
    });
})