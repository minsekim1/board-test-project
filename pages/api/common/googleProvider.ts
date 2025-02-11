import GoogleProvider from "next-auth/providers/google"; // GoogleProvider 임포트

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
});

export default googleProvider;
