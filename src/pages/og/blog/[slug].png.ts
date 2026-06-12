import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../lib/ogImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', e => !e.data.draft);
  return posts.map(p => ({ params: { slug: p.id }, props: { post: p } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any;
  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    badge: 'BLOG',
    categoryColor: '#a855f7',
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
