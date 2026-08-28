import { visit } from 'unist-util-visit';
export function remarkI18n() {
  return (tree) => {
    const newChildren = [];
    for (const child of tree.children) {
      let tags = [];
      visit(child, 'text', (node) => {
        const regex = /\[(ES|EN|\/ES|\/EN)\]/g;
        let m;
        while ((m = regex.exec(node.value)) !== null) {
            tags.push(m[1]);
        }
      });
      for (const tag of tags) {
          if (tag === 'ES') newChildren.push({ type: 'html', value: '\n<div data-i18n="es">\n' });
          if (tag === 'EN') newChildren.push({ type: 'html', value: '\n<div data-i18n="en">\n' });
      }
      visit(child, 'text', (node) => {
        node.value = node.value.replace(/\[(ES|EN|\/ES|\/EN)\]/g, '');
      });
      let isEmpty = false;
      if (child.type === 'paragraph') {
          const hasContent = child.children.some(c => c.type !== 'text' || c.value.trim() !== '');
          if (!hasContent) isEmpty = true;
      }
      if (!isEmpty) {
          newChildren.push(child);
      }
      for (const tag of tags) {
          if (tag === '/ES' || tag === '/EN') {
              newChildren.push({ type: 'html', value: '\n</div>\n' });
          }
      }
    }
    tree.children = newChildren;
  };
}