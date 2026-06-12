export const langs = { es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof langs;

export const ui = {
  es: {
    // Nav
    'nav.blog':     'blog',
    'nav.htb':      'htb',
    'nav.cves':     'cves',
    'nav.research': 'research',

    // Hero
    'hero.bio':      'Security Researcher • Pentester • CTF Player',
    'hero.location': 'Chile',
    'certs.label':   'certs',
    'certs.wip':     'en curso',

    // Sections
    'section.blog':      'blog',
    'section.htb':       'hackthebox',
    'section.cves':      'cves',
    'section.research':  'research',
    'section.seeAll':    'ver todos →',

    // Listing pages
    'blog.title':       'Blog',
    'blog.desc':        'Ideas, notas, pensamientos. Sin filtro.',
    'htb.title':        'HackTheBox',
    'htb.desc':         'Writeups de máquinas. Solo boxes retiradas.',
    'cves.title':       'CVEs',
    'cves.desc':        'Vulnerabilidades descubiertas y reportadas. Disclosure completo tras el patch.',
    'research.title':   'Research',
    'research.desc':    'Investigación técnica en profundidad.',

    // Post
    'post.back':        '← volver',
    'post.affected':    'Afectado',

    // Empty states
    'empty.blog':       'sin posts aún.',
    'empty.htb':        'sin writeups aún.',
    'empty.cves':       'sin CVEs publicados aún.',
    'empty.research':   'sin publicaciones aún.',

    // Footer
    'footer.github':    'github',
  },
  en: {
    'nav.blog':     'blog',
    'nav.htb':      'htb',
    'nav.cves':     'cves',
    'nav.research': 'research',

    'hero.bio':      'Security Researcher • Pentester • CTF Player',
    'hero.location': 'Chile',
    'certs.label':   'certs',
    'certs.wip':     'in progress',

    'section.blog':      'blog',
    'section.htb':       'hackthebox',
    'section.cves':      'cves',
    'section.research':  'research',
    'section.seeAll':    'see all →',

    'blog.title':       'Blog',
    'blog.desc':        'Ideas, notes, thoughts. No filter.',
    'htb.title':        'HackTheBox',
    'htb.desc':         'Machine writeups. Retired boxes only.',
    'cves.title':       'CVEs',
    'cves.desc':        'Vulnerabilities I found and reported. Full disclosure after patch.',
    'research.title':   'Research',
    'research.desc':    'Deep technical dives.',

    'post.back':        '← back',
    'post.affected':    'Affected',

    'empty.blog':       'no posts yet.',
    'empty.htb':        'no writeups yet.',
    'empty.cves':       'no CVEs published yet.',
    'empty.research':   'nothing published yet.',

    'footer.github':    'github',
  },
} as const;

export type UIKey = keyof typeof ui.es;

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key] ?? ui.es[key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first in langs) return first as Lang;
  return 'es';
}

export function getOtherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

export function localePath(lang: Lang, path: string): string {
  if (lang === 'es') return path;
  return `/en${path}`;
}
