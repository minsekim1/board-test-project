import Divider from "@components/Layout/Divider";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

const LoginPage = ({ user }: { user: Session["user"] | null }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTwitterLoading, setIsTwitterLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user && user.platform !== "email" && user.platform != null) {
      if (user.id === null) {
        signOut({ redirect: false });
        setError("가입되지 않은 계정입니다. 가입을 진행해주세요.");
      }
      else {
        const callbackUrl = new URL(window.location.href).searchParams.get("redirect") || "/";
        router.replace(callbackUrl || "/");
      }
    }
  }, [user]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedPassword = sessionStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력하세요.");
      setLoading(false);
      return;
    }
    // 로그인 시 callbackUrl을 함께 전달
    const result = await signIn("credentials", { email, password, redirect: false });

    setLoading(false);

    if (result?.error) return setError("이메일과 비밀번호를 다시 확인하세요.");

    // 로그인 정보 기억하기 체크되었을 때만 저장
    if (rememberMe) {
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
    } else {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
    }

    // 화면전환
    // 현재 페이지의 쿼리 파라미터에서 redirect 값을 가져옴
    const callbackUrl = new URL(window.location.href).searchParams.get("redirect") || "/";
    router.replace(callbackUrl || "/");
  };

  const handleOAuthLogin = async (e: React.MouseEvent<HTMLButtonElement>, provider: string) => {
    e.preventDefault();

    if (provider === "google") setIsGoogleLoading(true);
    if (provider === "twitter") setIsTwitterLoading(true);

    // 화면전환
    await signIn(provider, { redirect: false });

    // 이후는 useEffect 에서 처리
  };

  return (
    <section className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
          Board Test Project
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">🎉 Welcome Back! 🎉</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  이메일
                </label>
                <input
                  autoComplete="email"
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* 로그인 정보 기억하기 & 비밀번호 찾기 */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>로그인 정보 기억하기</span>
                </label>
                <a href={`/auth/email-find-password`} className="text-blue-600 hover:underline dark:text-blue-400">
                  비밀번호를 잊으셨나요?
                </a>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  style={{ height: 35 }}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : "로그인"}
                </button>
              </div>

              {/* 회원가입 링크 */}
              <div className="text-center text-sm text-gray-900 dark:text-gray-400">
                계정이 없나요?{" "}
                <a
                  href={router.query.redirect ? `/auth/signup?redirect=${encodeURIComponent(`${router.query.redirect}`)}` : "/auth/signup"}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  회원가입
                </a>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </form>

            <Divider />

            {/* Google and Twitter login buttons */}
            <div className="w-full mt-6">
              <div className="w-full h-full flex justify-center items-center space-x-4">
                <button
                  type="button"
                  className={`py-2.5 flex gap-3 items-center justify-center w-full border rounded-lg text-sm hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 ${isGoogleLoading ? "cursor-not-allowed bg-gray-100" : ""}`}
                  onClick={(e) => handleOAuthLogin(e, "google")}
                  disabled={isGoogleLoading}
                >
                  <svg width="24" height="24" className="google-icon" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                      <path
                        d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                        fill="#3F83F8"
                      ></path>
                      <path
                        d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                        fill="#FBBC04"
                      ></path>
                      <path
                        d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                        fill="#EA4335"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="20" height="20" fill="white" transform="translate(0.5)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                  {isGoogleLoading ? <FaSpinner className="animate-spin ml-3" /> : "구글로 로그인"}
                </button>

                <button
                  type="button"
                  className={`py-2.5 flex gap-3 items-center justify-center w-full border rounded-lg text-sm hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 ${isTwitterLoading ? "cursor-not-allowed bg-gray-100" : ""}`}
                  onClick={(e) => handleOAuthLogin(e, "twitter")}
                  disabled={isTwitterLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="6 6 36 36">
                    <linearGradient id="U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1" x1="4.338" x2="38.984" y1="-10.056" y2="49.954" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#4b4b4b"></stop>
                      <stop offset=".247" stopColor="#3e3e3e"></stop>
                      <stop offset=".686" stopColor="#2b2b2b"></stop>
                      <stop offset="1" stopColor="#252525"></stop>
                    </linearGradient>
                    <path fill="url(#U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1)" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28	C42,40.209,40.209,42,38,42z"></path>
                    <path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"></path>
                    <polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"></polygon>
                    <polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"></polygon>
                  </svg>
                  {isTwitterLoading ? <FaSpinner className="animate-spin ml-3" /> : "트위터로 로그인"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 세션이 없다면 로그인 페이지로 리다이렉트
  const session = await getSession({ req: context.req });

  return {
    props: {
      user: session?.user || null,
    },
  };
};

export default LoginPage;
