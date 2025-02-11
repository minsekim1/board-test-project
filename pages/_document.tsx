import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <title>Board Test Project - 테스트용 게시판 프로젝트</title>

        {/* Favicon과 아이콘 설정 */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* SEO 메타 태그 */}
        <meta
          name="description"
          content="테스트용 게시판 프로젝트입니다."
        />
        <meta name="author" content="Board Test Project" />
        <meta name="keywords" content="board, test, project, community, support, love, safe space, inclusivity" />
        <meta name="robots" content="index, follow" />




        {/* Open Graph 메타 태그 (소셜 미디어 최적화) */}
        <meta property="og:title" content="Board Test Project - 테스트용 게시판 프로젝트" />
        <meta property="og:description" content="테스트용 게시판 프로젝트입니다." />
        <meta property="og:image" content="/logo.png" />

        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />

        {/* Twitter 카드 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@board_test_project" />
        <meta name="twitter:title" content="Board Test Project - 테스트용 게시판 프로젝트" />
        <meta

          name="twitter:description"
          content="테스트용 게시판 프로젝트입니다."
        />
        <meta name="twitter:image" content="/logo.png" />


        {/* MS Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "pwptk4k85u");
              `,
          }}
        />
        <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
