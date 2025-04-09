#!/usr/bin/env node
const fs = require('fs')
const path = require('path');

let pdfMap = new Map(), categoryMap = new Map(), tagMap = new Map();

const sourceMarkdownsPath = path.join(__dirname, '../_markdowns');
const destinationPath = path.join(__dirname, '../docs');

// 复制 _markdowns 文件夹到 docs 文件夹
fs.cpSync(sourceMarkdownsPath, destinationPath, { recursive: true });

// 遍历docs/markdowns，找出分类，去除attributes
deep(destinationPath);

// 输出JSON
fs.writeFileSync('docs/category.json', JSON.stringify(Array.from(categoryMap, ([label, value]) => ({ label, value }))));
fs.writeFileSync('docs/tag.json', JSON.stringify(Array.from(tagMap, ([label, value]) => ({ label, value }))));


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
                const content = parseFrontMatter(itemPath, filePath);
                fs.writeFileSync(itemPath, content);
            }
            if (isPdf) {
                const title = item.split('.pdf')[0];
                pdfMap.set(nameKey, { title, isPdf, path: filePath });
            }
        }
    })
}

function parseFrontMatter(itemPath, filePath) {
    const content = fs.readFileSync(itemPath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return content;

    try {
        let title = '';
        lines = match[1].split('\n');
        lines.forEach(line => {
            const _title = line.split('title:')[1]?.trim(),
                _category = line.split('category:')[1]?.trim(),
                _date = line.split('date:')[1]?.trim(),
                _tag = line.split('- ')[1]?.trim();
            if (_title) {
                title = _title;
            }
            if (_category) {
                categoryMap.set(_category, [...categoryMap.get(_category) || [], { title: title, path: filePath }])
            }
            if (_tag) {
                tagMap.set(_tag, [...tagMap.get(_tag) || [], { title: title, path: filePath }])
            }
        })

        return match[2];
    } catch (e) {
        console.error('Error parsing front matter:', e);
        return content;
    }
}
