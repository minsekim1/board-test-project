import { executeQuery } from "@utils/executeQuery";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserQueryType = {
  email: string;
  platform: string;
  id: number;
  profile: string;
  
  nickname: string;
  level: number;
};

export const EmailLoginProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const { email, password } = credentials;
    const [user] = await executeQuery<(UserQueryType & { password_hash: string })[]>(
      `SELECT user_id id, email, platform, profile_picture profile, nickname, level, password_hash FROM user WHERE email = ? and platform = 'email' and deleted_at is null`,
      [email],
    );
    if (!user) return null;

    // const password_hash = await hash(password, 10); // 비밀번호를 해시 처리
    // console.log(email, password_hash);

    const isValid = await compare(password, user.password_hash);
    if (!isValid) return null;
    return {
      email: user.email,
      platform: user.platform,
      profile: user.profile,
      nickname: user.nickname,
      level: user.level,
      id: user.id.toString(),
    };
  },
});
