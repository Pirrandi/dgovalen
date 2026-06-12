import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../lib/ogImage';

const diffColor: Record<string, string> = {
  Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444', Insane: '#a855f7',
};

export const getStaticPaths: GetStaticPaths = async () => {
  const machines = await getCollection('htb', e => !e.data.draft);
  return machines.map(m => ({ params: { slug: m.id }, props: { machine: m } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { machine } = props as any;
  const color = diffColor[machine.data.difficulty] ?? '#a855f7';
  const png = await generateOgImage({
    title: machine.data.title,
    description: machine.data.description,
    badge: `HTB · ${machine.data.difficulty}`,
    categoryColor: color,
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
