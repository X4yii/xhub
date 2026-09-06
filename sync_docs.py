import os
import re
xhub_dir = "/home/x4/Documents/XHub/src/content/docs/x4ui"
x4ui_es_dir = "/home/x4/Documents/X4 Mods/X4UI/Docs/es-latam"
x4ui_en_dir = "/home/x4/Documents/X4 Mods/X4UI/Docs/en-us"
def find_local_file(xhub_rel_path):
    if xhub_rel_path.startswith("components/"):
        name = os.path.basename(xhub_rel_path)
        path_es = os.path.join(x4ui_es_dir, "components", name)
        path_en = os.path.join(x4ui_en_dir, "components", name)
        if os.path.exists(path_es) and os.path.exists(path_en):
            return path_es, path_en
        return None, None
    else:
        name = os.path.basename(xhub_rel_path)
        for f in os.listdir(x4ui_es_dir):
            if f.endswith("-" + name) or f == name:
                path_es = os.path.join(x4ui_es_dir, f)
                path_en = os.path.join(x4ui_en_dir, f)
                if os.path.exists(path_es) and os.path.exists(path_en):
                    return path_es, path_en
        return None, None
for root, _, files in os.walk(xhub_dir):
    for file in files:
        if not file.endswith(".md"):
            continue
        xhub_full_path = os.path.join(root, file)
        xhub_rel_path = os.path.relpath(xhub_full_path, xhub_dir)
        if file == "multimedia.md":
            continue
        path_es, path_en = find_local_file(xhub_rel_path)
        if not path_es:
            print(f"Skipping {xhub_rel_path}, no matching local files.")
            continue
        with open(xhub_full_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.match(r"^---\n.*?\n---\n", content, re.DOTALL)
        if not match:
            print(f"Skipping {xhub_rel_path}, no frontmatter found.")
            continue
        frontmatter = match.group(0)
        with open(path_es, "r", encoding="utf-8") as f:
            content_es = f.read()
        with open(path_en, "r", encoding="utf-8") as f:
            content_en = f.read()
        new_content = frontmatter + "\n[ES]\n" + content_es.strip() + "\n[/ES]\n\n[EN]\n" + content_en.strip() + "\n[/EN]\n"
        with open(xhub_full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Synced {xhub_rel_path}")
print("Done.")