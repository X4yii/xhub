import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkI18n } from './src/plugins/remark-i18n.mjs';

const markdown = `
[ES]
# Hola

Esto es español.
[/ES]

[EN]
# Hello

This is English.
[/EN]
`;

const file = await unified()
  .use(remarkParse)
  .use(remarkI18n)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
  .process(markdown);

console.log(String(file));
