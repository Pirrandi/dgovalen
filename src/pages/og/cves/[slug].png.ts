import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../lib/ogImage';

const sevColor: Record<string, string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b',
  Low: '#22c55e', Informational: '#06b6d4',
};

export const getStaticPaths: GetStaticPaths = async () => {
  const cves = await getCollection('cves', e => !e.data.draft);
  return cves.map(c => ({ params: { slug: c.id }, props: { cve: c } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { cve } = props as any;
  const color = sevColor[cve.data.severity] ?? '#ef4444';
  const png = await generateOgImage({
    title: `${cve.data.cve_id} — ${cve.data.title}`,
    description: cve.data.description,
    badge: `CVE · ${cve.data.severity.toUpperCase()}`,
    categoryColor: color,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
