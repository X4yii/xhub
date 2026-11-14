import os
import re

xhub_dir = "/home/x4yi/Documentos/xhub/src/content/docs/x4ui"
x4ui_es_dir = "/home/x4yi/Documentos/tmp/x4ui/Docs/es-latam"
x4ui_en_dir = "/home/x4yi/Documentos/tmp/x4ui/Docs/en-us"

# Mapeo canónico de archivos en XHub -> (archivo origen, título, categoría, categoryOrder, order)
DOC_MAP = {
    "getting-started.md": ("00-getting-started.md", "Getting Started", "General", 0, 0),
    "core-concepts.md": ("01-core-concepts.md", "Core Concepts", "General", 0, 1),
    "remote-assets.md": ("02-remote-assets.md", "Remote Assets", "General", 0, 2),
    "networking-and-sync.md": ("03-networking-and-sync.md", "Networking & Sync", "General", 0, 3),
    "responsive-layout-and-scaling.md": ("04-responsive-layout-and-scaling.md", "Responsive Layout & Scaling", "General", 0, 4),
    "graphics-and-rendering.md": ("05-graphics-and-rendering.md", "Graphics & Rendering (IGraphics)", "General", 0, 5),
    "typography-and-fonts.md": ("06-typography-and-fonts.md", "Vector Typography & Fonts (IFont)", "General", 0, 6),
    "gui-overlays-and-injection.md": ("07-gui-overlays-and-injection.md", "GUI Overlays & Injection", "General", 0, 7),
    "integrations-and-best-practices.md": ("08-integrations-and-best-practices.md", "Integrations & Best Practices", "General", 0, 8),
    "components/buttons-and-inputs.md": ("components/buttons-and-inputs.md", "Buttons & Inputs", "Components", 1, 0),
    "components/containers-and-panels.md": ("components/containers-and-panels.md", "Containers & Panels", "Components", 1, 1),
    "components/multimedia.md": ("components/multimedia.md", "Multimedia", "Components", 1, 2),
    "components/advanced-components.md": ("components/advanced-components.md", "Advanced Components", "Components", 1, 3),
}

for xhub_rel, (src_rel, title, category, cat_order, order) in DOC_MAP.items():
    path_es = os.path.join(x4ui_es_dir, src_rel)
    path_en = os.path.join(x4ui_en_dir, src_rel)
    xhub_full_path = os.path.join(xhub_dir, xhub_rel)

    if not (os.path.exists(path_es) and os.path.exists(path_en)):
        print(f"Skipping {xhub_rel}, missing source files.")
        continue

    os.makedirs(os.path.dirname(xhub_full_path), exist_ok=True)

    with open(path_es, "r", encoding="utf-8") as f:
        content_es = f.read().strip()
    with open(path_en, "r", encoding="utf-8") as f:
        content_en = f.read().strip()

    frontmatter = (
        f"---\n"
        f'title: "{title}"\n'
        f'project: "X4UI"\n'
        f'category: "{category}"\n'
        f"categoryOrder: {cat_order}\n"
        f"order: {order}\n"
        f"---\n"
    )

    new_content = f"{frontmatter}\n[ES]\n{content_es}\n[/ES]\n\n[EN]\n{content_en}\n[/EN]\n"
    with open(xhub_full_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Synced {xhub_rel}")

print("Done.")
