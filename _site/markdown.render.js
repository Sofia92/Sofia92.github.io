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
// 加载文档内容
export async function loadContent(path) {
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
        const { content } = parseFrontMatter(await response.text());
        // 获取文档所在目录路径
        const basePath = path.substring(0, path.lastIndexOf('/') + 1);

        // 创建新的渲染器并配置图片处理
        const renderer = new marked.Renderer();
        renderer.image = function (hrefObj, title, text) {
            let href = typeof hrefObj == 'object' ? hrefObj.href : hrefObj;
            if (href && !href.startsWith('http') && !href.startsWith('/')) {
                href = basePath + href;
            }
            return `<img src="${href}" title="${title || ''}" alt="${text || ''}" style="max-width: 100%;">`;
        };
        // 使用配置的renderer渲染markdown
        marked.use({ renderer });
        const html = marked.parse(content);
        document.getElementById('content').innerHTML = html;
        hljs.highlightAll();

        // 动态更新浏览器 title 为文档名称
        const title = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
        document.title = `Sofia的知识库 | ${title}`;

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
