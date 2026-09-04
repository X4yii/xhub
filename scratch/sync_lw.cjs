const fs = require('fs');
const path = require('path');

const LW_DIR = "/home/x4/Documents/X4 Mods/LethalWeaponry";
const XHUB_DIR = "/home/x4/Documents/XHub";

const lw_docs = [
    ["docs/es/MECHANICS.md", "docs/en/MECHANICS.md", "src/content/docs/lethalweaponry/02-systems/01-technical.md"],
    ["docs/es/USER_GUIDE.md", "docs/en/USER_GUIDE.md", "src/content/docs/lethalweaponry/00-introduction/00-overview.md"],
    ["src/main/resources/assets/lethalweaponry/guide/katana.md", "src/main/resources/assets/lethalweaponry/guide/katana.md", "src/content/docs/lethalweaponry/01-weapons/01-katana.md"],
    ["src/main/resources/assets/lethalweaponry/guide/scythe.md", "src/main/resources/assets/lethalweaponry/guide/scythe.md", "src/content/docs/lethalweaponry/01-weapons/02-scythe.md"],
    ["src/main/resources/assets/lethalweaponry/guide/warhammer.md", "src/main/resources/assets/lethalweaponry/guide/warhammer.md", "src/content/docs/lethalweaponry/01-weapons/00-warhammer.md"],
    ["src/main/resources/assets/lethalweaponry/guide/chainblade.md", "src/main/resources/assets/lethalweaponry/guide/chainblade.md", "src/content/docs/lethalweaponry/01-weapons/03-chainblade.md"]
];

for (const item of lw_docs) {
    const es_path = path.join(LW_DIR, item[0]);
    const en_path = path.join(LW_DIR, item[1]);
    const dest_path = path.join(XHUB_DIR, item[2]);
    
    if (!fs.existsSync(es_path) || !fs.existsSync(en_path)) {
        console.log(`Skipping missing file: ${es_path} or ${en_path}`);
        continue;
    }
    
    const es_content = fs.readFileSync(es_path, 'utf-8').trim();
    const en_content = fs.readFileSync(en_path, 'utf-8').trim();
    
    let frontmatter = "";
    if (fs.existsSync(dest_path)) {
        const dest_content = fs.readFileSync(dest_path, 'utf-8');
        const match = dest_content.match(/(^---[\s\S]+?---\n)/);
        if (match) {
            frontmatter = match[1].trim();
        }
    }
    
    fs.mkdirSync(path.dirname(dest_path), { recursive: true });
    
    if (es_path === en_path) {
        // If they point to the exact same file (like the assets/guide/*.md files), they already contain ES and EN, or just EN.
        // Actually, let's assume they are EN only if no ES/EN blocks are found. Wait, no, we just copy it into [ES] and [EN] to be safe, or just read it.
        // If it's a single file, it's typically bilingual or just raw. Let's just wrap it.
        fs.writeFileSync(dest_path, `${frontmatter}\n\n[ES]\n${es_content}\n[/ES]\n\n[EN]\n${en_content}\n[/EN]\n`, 'utf-8');
    } else {
        fs.writeFileSync(dest_path, `${frontmatter}\n\n[ES]\n${es_content}\n[/ES]\n\n[EN]\n${en_content}\n[/EN]\n`, 'utf-8');
    }
    console.log(`Synced: ${item[2]}`);
}

// Sync Changelog
const lw_cl_src = path.join(LW_DIR, "docs/changelogs/changelog-r1.0b10.md");
const lw_cl_dest = path.join(XHUB_DIR, "src/content/changelogs/lethalweaponry/r1.0b10.md");

if (fs.existsSync(lw_cl_src)) {
    const cl_content = fs.readFileSync(lw_cl_src, 'utf-8');
    
    let es_text = "";
    let en_text = "";
    
    if (cl_content.includes("[ES]")) {
        const es_match = cl_content.match(/\[ES\]([\s\S]*?)\[\/ES\]/);
        const en_match = cl_content.match(/\[EN\]([\s\S]*?)\[\/EN\]/);
        es_text = es_match ? es_match[1].trim() : "";
        en_text = en_match ? en_match[1].trim() : "";
    } else {
        const es_match = cl_content.match(/## \[ES\] Español([\s\S]*?)(?=## \[EN\] English|$)/);
        const en_match = cl_content.match(/## \[EN\] English([\s\S]*)/);
        es_text = es_match ? es_match[1].trim() : cl_content;
        en_text = en_match ? en_match[1].trim() : cl_content;
    }
    
    const lw_fm = `---\ntitle: "LethalWeaponry r1.0b10"\ndate: 2026-09-03\nproject: "LethalWeaponry"\nversion: "r1.0b10"\n---`;
    fs.writeFileSync(lw_cl_dest, `${lw_fm}\n\n# LethalWeaponry r1.0b10\n\n[ES]\n${es_text}\n[/ES]\n\n[EN]\n${en_text}\n[/EN]\n`, 'utf-8');
    console.log(`Synced changelog: src/content/changelogs/lethalweaponry/r1.0b10.md`);
}
