export default function i18nPlugin() {
  return {
    name: 'vite-plugin-i18n',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.md') || id.endsWith('.mdx')) {
        let newCode = code.replace(/\[(ES|EN)\]([\s\S]*?)\[\/\1\]/gi, (match, lang, content) => {
          return `\n<div data-i18n="${lang.toLowerCase()}">\n\n${content}\n\n</div>\n`;
        });
        return { code: newCode };
      }
    }
  }
}