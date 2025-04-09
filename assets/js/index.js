async function loadData() {
    const response = await fetch('./docs/category.json');
    if (!response.ok) {
        throw new Error('文档加载失败');
    }
    return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('main');

    loadData().then(res => {
        res.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('flex');
            categoryDiv.classList.add('gap-sm');
            categoryDiv.setAttribute('appCard', true);
            categoryDiv.setAttribute('vertical', true);
            categoryDiv.setAttribute('data-category', category.label);

            categoryDiv.innerHTML = `
    <header><strong>${category.label}</strong></header>
    <div class="articles">
    ${category.value.slice(0, 4).map(article => (`<p class="truncate">${article.title}</p>`)).join('')}
    </div>`;
            wrapper.appendChild(categoryDiv);
        });
    })

    wrapper.addEventListener('click', ($event) => {
        // 控制台打印数据的名称
        const categoryHtml = $event.target.closest("[data-category]");

        if (categoryHtml) {
            const category = categoryHtml.dataset.category;
            window.location.assign(`${location.origin}/docs/category?category=${category}`);
            return;
        }
    });
})