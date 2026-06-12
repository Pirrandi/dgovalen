import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog', e => !e.data.draft);
  const htb  = await getCollection('htb',  e => !e.data.draft);
  const cves = await getCollection('cves', e => !e.data.draft);

  const items = [
    ...blog.map(p => ({ title: p.data.title, pubDate: p.data.date, description: p.data.description, link: `/blog/${p.id}` })),
    ...htb.map(p  => ({ title: p.data.title, pubDate: p.data.date, description: p.data.description, link: `/htb/${p.id}` })),
    ...cves.map(p => ({ title: `${p.data.cve_id} — ${p.data.title}`, pubDate: p.data.date, description: p.data.description, link: `/cves/${p.id}` })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'dgovalen',
    description: 'Security researcher — CVEs, HTB writeups, research.',
    site: context.site!,
    items,
  });
}
