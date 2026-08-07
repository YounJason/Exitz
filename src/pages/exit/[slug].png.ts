import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const getStaticPaths: GetStaticPaths = async () => {
  const exitPosts = await getCollection("exit");
  return exitPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

async function getLocalImageDataUrl(relativePath: string): Promise<string | null> {
  try {
    const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
    const filePath = path.join(process.cwd(), "public", cleanPath);
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).replace(".", "") || "png";
    return `data:image/${ext};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error(`이미지 로드 실패: ${relativePath}`, error);
    return null;
  }
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;

  const serviceLogoUrl = post.data.logo ? await getLocalImageDataUrl(post.data.logo) : null;
  const brandLogoUrl = await getLocalImageDataUrl("/logo1.png");

  const fontPath = path.join(process.cwd(), "public", "DMSans-ExtraBold.ttf");
  const fontData = await fs.readFile(fontPath);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "36px", // 전체 레이아웃을 아래로 이동
          gap: "8px",
        },
        children: [
          // 1. 적절한 크기로 확대한 쿠팡 로고 카드 (160x160)
          {
            type: "div",
            props: {
              style: {
                width: "160px",
                height: "160px",
                backgroundColor: "#ffffff",
                borderRadius: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.07)",
                padding: "16px",
              },
              children: [
                serviceLogoUrl
                  ? {
                      type: "img",
                      props: {
                        src: serviceLogoUrl,
                        style: {
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        },
                      },
                    }
                  : null,
              ],
            },
          },
          // 2. 메인 브랜딩 Exitz 로고 (180px)
          brandLogoUrl
            ? {
                type: "img",
                props: {
                  src: brandLogoUrl,
                  style: {
                    height: "180px",
                    objectFit: "contain",
                  },
                },
              }
            : null,
        ],
      },
    },
    {
      width: 800,
      height: 450,
      fonts: [
        {
          name: "DM Sans",
          data: fontData,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 800 },
  });
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};