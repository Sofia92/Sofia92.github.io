#!/usr/bin/env node
const fs = require('fs')
const path = require('path');

let markdownMap = new Map(), pdfMap = new Map();

const sourceMarkdownsPath = path.join(__dirname, '../_markdowns');
const destinationPath = path.join(__dirname, '../docs');

// 复制 _markdowns 文件夹到 docs 文件夹
fs.cpSync(sourceMarkdownsPath, destinationPath, { recursive: true });

// 遍历docs/markdowns，找出分类，去除attributes
deep(destinationPath);

fs.writeFileSync('docs/list.json', JSON.stringify([...markdownMap.values()].concat([...pdfMap.values()])));


function deep(dir) {
    const folders = fs.readdirSync(dir);

    folders.forEach(item => {
        const itemPath = path.join(dir, item);
        const isDir = fs.statSync(itemPath).isDirectory()
        if (isDir) {
            deep(itemPath);
        } else {
            const nameKey = Symbol();
            const isMarkdown = item.endsWith('.md'), isPdf = item.endsWith('.pdf');
            const relativePath = path.relative(path.join(__dirname, '../docs'), itemPath);
            const filePath = `./${relativePath}`;
            if (isMarkdown) {
                const title = item.split('.md')[0];
                const response = fs.readFileSync(itemPath, 'utf-8');
                const { attributes, content } = parseFrontMatter(response);
                fs.writeFileSync(itemPath, content);

                markdownMap.set(nameKey, {
                    title, category: null, ...attributes,
                    isMarkdown, isPdf, path: filePath
                });
            }
            if (isPdf) {
                const title = item.split('.pdf')[0];
                markdownMap.set(nameKey, {
                    title, category: null,
                    isMarkdown, isPdf, path: filePath
                });
            }
        }
    })
}

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
