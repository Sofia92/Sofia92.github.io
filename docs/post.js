import { loadContent } from './markdown.render.js';

const categoryMap = new Map([
    ['Internet', 'Internet'],
    ['Infrastructure', '基础知识'],
    ['VersionControl', '版本管理'],
    ['Framework', '前端框架和库'],
    ['CSSArchitecture', 'CSSArchitecture'],
    ['BuildTools', '构建工具'],
    ['Authentication', '身份验证和授权策略'],
    ['WebSecurity', 'Web 安全'],
    ['WebComponents', 'WebComponents'],
    ['CodeQuality', '代码质量'],
    ['Testing', '测试'],
    ['SSR', 'SSR'],
    ['GraphQL', 'GraphQL'],
    ['PWAs', 'PWAs'],
    ['WebAssembly', 'WebAssembly'],
    ['Performance', 'Performance'],
    ['Mobile', '移动端开发'],
    ['DevOps', 'DevOps 和部署'],
    ['A11y', '可访问性和国际化'],
    ['Team', '软技能'],
    ['PDFs', 'PDF附件']
])
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从 URL hash 加载初始文档
    if (window.location.hash) {
        const path = window.location.hash.slice(1);
        loadContent(path);
    }
    fetch('./list.json')
        .then(response => response.json())
        .then(docs => {
            let category = null;
            if (window.location.search) {
                const searchParams = new URLSearchParams(window.location.search);
                category = searchParams.get('category') || null;
            }
            const filesContainer = document.querySelector('.folder');
            let categoryDocs = docs.filter(doc => doc.category == category);
            if (category == 'PDFs') {
                categoryDocs = docs.filter(doc => doc.isPdf);
            }

            categoryDocs.forEach(doc => {
                const fileElement = document.createElement('li');
                fileElement.className = 'folder-item';
                fileElement.innerHTML = `<a href="#" data-path="${doc.path}">${doc.title}</a>`;
                filesContainer.appendChild(fileElement);
            });
            if (category) {
                document.querySelector('#breadcrumb_category').innerHTML = categoryMap.get(category)
            }
        })
        .catch(error => console.error('Error loading data:', error));

    // // 默认展开所有文件夹
    // const firstFolder = document.querySelector('.folder-content');
    // firstFolder.classList.add('open');

    // 默认折叠菜单
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});

// 为链接添加点击事件委托
document.querySelector('.folder').addEventListener('click', (e) => {
    if (!e.target.dataset?.path) return;

    loadContent(e.target.dataset.path);
    // 在手机小屏幕模式下，点了folder-title后，收起 sidebar
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});

// 为文件夹标题添加点击事件
document.querySelectorAll('.folder-title').forEach(title => {
    title.addEventListener('click', () => {
        const content = title.nextElementSibling;
        content.classList.toggle('open');
    });
});

// 为菜单按钮添加点击事件
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});

