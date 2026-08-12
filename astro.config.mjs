// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

const [githubOwner = '', githubRepo = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isUserSite = githubRepo === `${githubOwner}.github.io`;
const site = githubOwner ? `https://${githubOwner}.github.io` : 'http://localhost:4321';
const base = githubRepo && !isUserSite ? `/${githubRepo}` : '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
