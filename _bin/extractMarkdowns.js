#!/usr/bin/env node
const fs = require('fs')
const path = require('path');
const process = require('process');
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

function getExtension(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

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
            const relativePath = path.relative(path.join(__dirname, '../'), itemPath);
            const filePath = `https://github.com/Sofia92/Sofia92.github.io/blob/master/${relativePath}`;
            if (isMarkdown) {
                const title = item.split('.md')[0];
                const response = fs.readFileSync(itemPath, 'utf-8');
                const { attributes } = parseFrontMatter(response);
                markdownMap.set(nameKey, {
                    title, category: null, ...attributes,
                    isMarkdown, isPdf, path: filePath
                });
            }
            if (isPdf) {
                const title = item.split('.pdf')[0];
                markdownMap.set(nameKey, {
                    title, category: null, ...attributes,
                    isMarkdown, isPdf, path: filePath
                });
            }
        }
    })
}

let markdownMap = new Map(), pdfMap = new Map();
deep(path.join(__dirname, '../_posts'));

fs.writeFileSync('docs/list.json', JSON.stringify([...markdownMap.values()].concat([...pdfMap.values()])));