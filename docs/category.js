import { loadContent } from './markdown.render.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    let category = null, tag = null, hashPath = window.location.hash?.slice(1);

    //  从 URL hash 加载初始文档
    if (hashPath) {
        loadContent(hashPath);
    }
    if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        category = searchParams.get('category') || null;
        tag = searchParams.get('tag') || null;
    }
    const filePath = !!category ? './category.json' : './tag.json';

    fetch(filePath)
        .then(response => response.json())
        .then(docs => {
            const filesContainer = document.querySelector('.sidebar');

            docs.forEach(doc => {
                const isCurrent = doc.label == category || doc.label == tag;
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('folder');
                if (isCurrent) {
                    categoryDiv.classList.add('open');
                }

                categoryDiv.innerHTML = `
    <header class="folder-title"><strong>${doc.label}</strong></header>
    <div class="folder-content">
    ${doc.value.map(article => (`<a href="#" data-path="${article.path}" class="${hashPath && decodeURI(hashPath) == article.path ? 'active' : ''}">${article.title}</a>`)).join('')}
    </div>`;
                filesContainer.appendChild(categoryDiv);
            });
        })
        .catch(error => console.error('Error loading data:', error));

    // 默认折叠菜单
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});



// 为链接添加点击事件委托
document.querySelector('.sidebar').addEventListener('click', (e) => {
    const folderTitleHtml = e.target.closest('.folder-title');

    if (!!folderTitleHtml) {
        const folder = folderTitleHtml.parentElement;
        folder.classList.toggle('open');
    }

    const linkPath = e.target.dataset.path;
    if (!!linkPath) {
        loadContent(e.target.dataset.path);

        // 在手机小屏幕模式下，点了folder-title后，收起 sidebar
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('open');
        }
    }
});

// 为菜单按钮添加点击事件
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});

