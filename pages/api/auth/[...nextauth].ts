import googleProvider from "@api/common/googleProvider";
import twitterProvider from "@api/common/twitterProvider";
import { executeQuery } from "@utils/executeQuery";
import NextAuth from "next-auth";
import { EmailLoginProvider, UserQueryType } from "../common/EmailLoginProvider";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null; //26;
      nickname: string; //"minse kim";
      profile: string; //"https://localhost/logo.png";
      email: string; //"tkarnrwl78627862@gmail.com";
      platform: string; //"email";
      level: number; //1;
    };
  }
}

export default NextAuth({
  providers: [EmailLoginProvider, googleProvider, twitterProvider],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // console.log("jwt", { token, user, account, profile });
      if (user) {
        const provider = account?.provider;
        // 1. 구글 로그인 시 user 정보를 token에 저장
        const email = provider === "credentials" ? token.email : provider === "twitter" ? token.name : token.email;


        // 2. DB에서 user_id 조회 (query 함수는 MySQL 쿼리 실행 함수로 가정)
        const result = await executeQuery<UserQueryType[]>(
          "SELECT user_id id, email, platform, profile_picture profile, nickname, level FROM user WHERE email = ? and platform = ? and deleted_at is null",
          [email, provider === "credentials" ? "email" : provider],
        );
        
        // 3. user_id를 토큰에 저장
        if (result.length > 0) token.user = { ...result[0], id: result[0].id.toString() };
        else token.user = { id: null, email: email, platform: provider, profile: user.image, nickname: user.name, level: null };
      }
      return token;
    },
    async session({ session, token,trigger }) {
      if (trigger === 'update' && session.user.nickname) {
        token.nickname = session.user.nickname;
      }

      session.user = token.user as any; // 세션에서 user 정보를 반환
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        domain: process.env.NODE_ENV === "production" ? ".domain.com" : "localhost",
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Lax",
        secure: process.env.NODE_ENV === "production", // 프로덕션에서는 HTTPS 필수
        httpOnly: true,
      },
    },
  },
});
