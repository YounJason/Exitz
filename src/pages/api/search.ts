export const prerender = false;

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getViewCounts } from "../../lib/views";

const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ",
  "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];
const JUNGSUNG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ",
  "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"
];
const JONGSUNG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ",
  "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ",
  "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];
const JONG_EXPAND: Record<string, string> = {
  "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ",
  "ㄻ": "ㄹㅁ", "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㄾ",
  "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ"
};

function decomposeHangul(str: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const index = code - 0xac00;
      const jong = index % 28;
      const jung = Math.floor((index - jong) / 28) % 21;
      const cho = Math.floor((index - jong) / 28 / 21);

      result += CHOSUNG[cho] + JUNGSUNG[jung];
      if (jong > 0) {
        const jChar = JONGSUNG[jong];
        result += JONG_EXPAND[jChar] || jChar;
      }
    } else {
      result += str[i];
    }
  }
  return result.toLowerCase();
}

function getChosung(str: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const index = code - 0xac00;
      const cho = Math.floor((index - (index % 28)) / 28 / 21);
      result += CHOSUNG[cho];
    } else {
      result += str[i];
    }
  }
  return result.toLowerCase();
}

function isOnlyChosung(str: string) {
  return str.split("").every((char) => CHOSUNG.includes(char) || char === " ");
}

function matchKorean(target: string, query: string) {
  if (!target || !query) return false;
  const cleanTarget = target.trim().toLowerCase();
  const cleanQuery = query.trim().toLowerCase();

  if (cleanTarget.includes(cleanQuery)) return true;

  const decTarget = decomposeHangul(cleanTarget);
  const decQuery = decomposeHangul(cleanQuery);
  if (decTarget.includes(decQuery)) return true;

  if (isOnlyChosung(cleanQuery)) {
    const choTarget = getChosung(cleanTarget);
    if (choTarget.includes(cleanQuery)) return true;
  }

  return false;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const query = url.searchParams.get("q")?.trim() || "";
  
  if (!query) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const exitPosts = await getCollection("exit");
  const privacyPosts = await getCollection("help");
  const runtimeEnv = (locals as { runtime?: { env?: any } }).runtime?.env as any;

  const exitSlugs = exitPosts.map((post: any) => post.slug || post.id);
  const helpSlugs = privacyPosts.map((post: any) => post.slug || post.id);

  const exitViewMap = runtimeEnv
    ? await getViewCounts(runtimeEnv, "exit", exitSlugs)
    : {};
  const helpViewMap = runtimeEnv
    ? await getViewCounts(runtimeEnv, "help", helpSlugs)
    : {};

  const exitMatches = exitPosts
    .filter(
      (x: any) =>
        matchKorean(x.data.domain, query) ||
        matchKorean(x.data.serviceName, query)
    )
    .map((x: any) => {
      const slug = x.slug || x.id;
      return {
        type: "exit",
        title: x.data.serviceName,
        sub: x.data.domain,
        slug,
        logo: x.data.logo || null,
        views: exitViewMap[slug] ?? 0,
      };
    });

  const helpMatches = privacyPosts
    .filter((x: any) => matchKorean(x.data.title, query))
    .map((x: any) => {
      const slug = x.slug || x.id;
      return {
        type: "help",
        title: x.data.title,
        sub: "",
        slug,
        logo: null,
        views: helpViewMap[slug] ?? 0,
      };
    });

  const results = [...exitMatches, ...helpMatches]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 6);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};