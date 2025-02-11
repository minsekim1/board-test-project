import getRandomUserNickname from "@api/common/createUserNickname";
import apiRequest from "@utils/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const SignupFormPage = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"man" | "woman" | "other" | null>(null); // 기본 값

  useEffect(() => {
    const nickname = sessionStorage.getItem("nickname") || getRandomUserNickname();
    if (nickname) setNickname(nickname);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");
    const profile = sessionStorage.getItem("profile");
    const platform = router.query.platform;


    if (!email || !password) {
      setError("잘못된 경로의 접근입니다.");
      setLoading(false);
      return;
    }

    const { data, error } = await apiRequest<{ user_id: number }>("POST", "/api/user", { email, nickname, password, platform: platform || "email", role: userType, profile_picture:profile });

    if (!data || error) {
      setError(error || "회원가입 실패");
      setLoading(false);
      return;
    }

    setLoading(false);

    const url = router.query.redirect ? `${router.query.redirect}` : `/user/${nickname}`;
    if (typeof platform === "string") await signIn(platform, { callbackUrl: url });
    else await signIn("credentials", { email, password, callbackUrl: url });


    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("profile");
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
            <h1 className="text-center text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2lg dark:text-white">🎉 가입 마지막 단계 🎉</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  닉네임
                </label>
                <input
                  autoComplete="nickname"
                  type="text"
                  name="nickname"
                  id="nickname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="닉네임"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  구분
                </label>
                <div className="flex justify-between gap-0.5">
                  <button
                    type="button"
                    className={`w-1/3 text-white ${userType === "man" ? "bg-blue-600" : "bg-gray-300"} font-medium rounded-l-lg text-sm px-5 py-2.5 text-center`}
                    onClick={() => setUserType("man")}
                  >
                    남자
                  </button>
                  <button
                    type="button"
                    className={`w-1/3 text-white ${userType === "woman" ? "bg-blue-600" : "bg-gray-300"} font-medium rounded-none text-sm px-5 py-2.5 text-center`}
                    onClick={() => setUserType("woman")}
                  >
                    여자
                  </button>
                  <button

                    type="button"
                    className={`w-1/3 text-white ${userType === "other" ? "bg-blue-600" : "bg-gray-300"} font-medium rounded-r-lg text-sm px-5 py-2.5 text-center`}
                    onClick={() => setUserType("other")}
                  >
                    기타
                  </button>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className={`w-full text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  style={{ height: 35 }}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : "가입 완료"}
                </button>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupFormPage;
