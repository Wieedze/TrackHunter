// Submit every URL of the live sitemap to IndexNow (Bing, Yandex, Seznam…;
// Bing feeds ChatGPT search and Copilot). Run after a deploy:
//   node scripts/indexnow.mjs
// The key file public/bb85306436896c8d0f2496704be53bee.txt must be live at the site root.
const SITE = 'https://track-hunter.com';
const KEY = 'bb85306436896c8d0f2496704be53bee';

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const keyCheck = await fetch(`${SITE}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  throw new Error(`Key file ${SITE}/${KEY}.txt is not live yet — deploy first.`);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs submitted`);
if (!res.ok) console.log(await res.text());
