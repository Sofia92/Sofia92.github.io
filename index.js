// 解析 front matter
function parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { attributes: {}, content };

    try {
        const attributes = {};
        match[1].split('\n').forEach(line => {
            const [key, value] = line.split(':').map(str => str.trim());
            if (key && value) {
                attributes[key] = isNaN(value) ? value : Number(value);
            }
        });
        return {
            attributes,
            content: match[2]
        };
    } catch (e) {
        console.error('Error parsing front matter:', e);
        return { attributes: {}, content };
    }
}

// 配置 marked
marked.setOptions({
    highlight: function (code, lang) {
        if (lang) {
            // 处理特殊语言标记
            const languageMap = {
                'ts': 'typescript',
                'typescript': 'typescript',
                'js': 'javascript',
                'javascript': 'javascript',
                'bash': 'bash',
                'shell': 'bash',
                'json': 'json',
                'yaml': 'yaml',
                'yml': 'yaml'
            };

            const mappedLang = languageMap[lang.toLowerCase()] || lang;

            try {
                if (hljs.getLanguage(mappedLang)) {
                    return `<div class="code-header">${lang}</div><pre class="code-block"><code class="hljs language-${mappedLang}">${hljs.highlight(code, {
                        language: mappedLang
                    }).value}</code></pre>`;
                }
            } catch (error) {
                console.warn('Language highlight error:', error);
            }
        }
        // 如果没有指定语言或语言不支持，尝试自动检测
        return `<pre><code class="hljs">${hljs.highlightAuto(code).value}</code></pre>`;
    },
    breaks: true,
    renderer: new marked.Renderer()
});

// 加载并排序目录内容
async function loadDirectoryContent(folderElement) {
    const links = Array.from(folderElement.querySelectorAll('a'));
    const sortedLinks = [];

    for (const link of links) {
        try {
            const response = await fetch(link.dataset.path);
            if (!response.ok) continue;

            sortedLinks.push({
                element: link,
                sort: Infinity,
                title: link.textContent
            });
        } catch (error) {
            console.warn('Error loading file:', error);
            sortedLinks.push({
                element: link,
                sort: Infinity,
                title: link.textContent
            });
        }
    }

    // 排序链接
    sortedLinks.sort((a, b) => {
        if (a.sort === b.sort) {
            return a.title.localeCompare(b.title, 'zh-CN');
        }
        return a.sort - b.sort;
    });

    // 重新插入排序后的链接
    const parent = links[0].parentNode;
    sortedLinks.forEach(({ element }) => {
        parent.appendChild(element);
    });
}

// 加载文档内容
async function loadContent(path) {
    try {
        // Check if the file is a PDF
        if (path.toLowerCase().endsWith('.pdf')) {
            document.getElementById('content').innerHTML = `
                <object
                    data="${path}"
                    type="application/pdf"
                    width="100%"
                    height="800px"
                    style="border: none;"
                >
                    <p>
                        看起来您的浏览器不支持嵌入式PDF。
                        您可以 <a href="${path}" target="_blank">点击此处下载PDF文件</a>。
                    </p>
                </object>
            `;

            // 高亮当前选中的文档
            document.querySelectorAll('.sidebar a').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.path === path) {
                    link.classList.add('active');
                }
            });

            // 更新 URL hash
            window.location.hash = path;
            return;
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('文档加载失败');
        }
        const text = await response.text();

        // 解析 front matter
        const { content } = parseFrontMatter(text);

        // 获取文档所在目录路径
        const basePath = path.substring(0, path.lastIndexOf('/') + 1);

        // 创建新的渲染器并配置图片处理
        const renderer = new marked.Renderer();
        renderer.image = function (hrefObj, title, text) {
            let href = hrefObj.href;
            if (href && !href.startsWith('http') && !href.startsWith('/')) {
                href = basePath + href;
            }
            return `<img src="${href}" title="${title || ''}" alt="${text || ''}" style="max-width: 100%;">`;
        };

        // 使用配置的renderer渲染markdown
        const html = marked.parse(content, { renderer });
        document.getElementById('content').innerHTML = html;

        // 高亮当前选中的文档
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.path === path) {
                link.classList.add('active');
            }
        });

        // 更新 URL hash
        window.location.hash = path;
    } catch (error) {
        document.getElementById('content').innerHTML = `
            <div style="color: #dc3545; padding: 2rem; text-align: center;">
                <h3>😕 加载失败</h3>
                <p>${error.message}</p>
                <p>请确保文档文件存在并且可以访问。</p>
            </div>
        `;
    }
}

// 初始化时对所有目录进行排序
async function initializeFolders() {
    const folderContents = document.querySelectorAll('.folder-content');
    for (const folderContent of folderContents) {
        await loadDirectoryContent(folderContent);
    }
}

// 为所有链接添加点击事件
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(link.dataset.path);
    });
});

// 为文件夹标题添加点击事件
document.querySelectorAll('.folder-title').forEach(title => {
    title.addEventListener('click', () => {
        const content = title.nextElementSibling;
        content.classList.toggle('open');
    });
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeFolders();

    // 从 URL hash 加载初始文档
    if (window.location.hash) {
        const path = window.location.hash.slice(1);
        loadContent(path);

        // 打开包含当前文档的文件夹
        const link = document.querySelector(`a[data-path="${path}"]`);
        if (link) {
            const folderContent = link.closest('.folder-content');
            if (folderContent) {
                folderContent.classList.add('open');
            }
        }
    }

    // 默认展开所有文件夹
    document.querySelectorAll('.folder-content').forEach(content => {
        content.classList.add('open');
    });
});