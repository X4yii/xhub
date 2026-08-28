import { getCollection } from 'astro:content';

export async function GET() {
    const docs = await getCollection('docs');
    const noticias = await getCollection('noticias');
    const changelogs = await getCollection('changelogs');

    const allEntries = [...docs, ...noticias, ...changelogs];
    const index = [];

    allEntries.forEach(entry => {
        const body = entry.body || '';
        
        // Extract ES content
        const esMatch = body.match(/\[ES\]([\s\S]*?)\[\/ES\]/);
        const esContent = esMatch ? esMatch[1].replace(/[#*`_]/g, '').trim() : '';
        
        // Extract EN content
        const enMatch = body.match(/\[EN\]([\s\S]*?)\[\/EN\]/);
        const enContent = enMatch ? enMatch[1].replace(/[#*`_]/g, '').trim() : '';

        // Determine URL based on collection
        let url = '';
        if (entry.collection === 'docs') {
            url = `/xhub/docs/${entry.slug}`;
        } else if (entry.collection === 'noticias') {
            url = `/xhub/noticias/${entry.id}`;
        } else if (entry.collection === 'changelogs') {
            const projectSlug = entry.id.split('/')[0];
            url = `/xhub/changelogs/${projectSlug}#${entry.data.version}`;
        }

        // Add to index
        index.push({
            title: entry.data.title,
            url: url,
            project: entry.data.project || 'General',
            es: esContent,
            en: enContent
        });
    });

    return new Response(JSON.stringify(index), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
