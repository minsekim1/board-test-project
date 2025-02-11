import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectUrl = router.query.redirect || "/"; // 쿼리 파라미터로 받은 리디렉션 URL, 없으면 기본값 "/"

    // 로그아웃 처리
    signOut({ redirect: false }).then(() => {
      // 로그아웃 후 리디렉션
      router.push(redirectUrl as string);
    });
  }, [router]);

  return (
    <div>
      <h1>로그아웃 중...</h1>
    </div>
  );
};

export default LogoutPage;
