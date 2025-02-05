import { SessionProvider } from "next-auth/react";
import "../public/global.css"; // global.css 파일을 임포트
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.locale("ko");
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      {/* 로컬 환경에서만 Analytics와 SpeedInsights를 제외 */}
      {process.env.NODE_ENV !== "development" && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </SessionProvider>
  );
}
