import TwitterProvider from "next-auth/providers/twitter"; // TwitterProvider 임포트

const twitterProvider = TwitterProvider({
  clientId: process.env.TWITTER_CLIENT_ID ?? "",
  clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
});

export default twitterProvider;

