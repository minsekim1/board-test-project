import apiRequest from "@utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const FindPasswordFormPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      setLoading(false);
      return;
    }

    const { data, error } = await apiRequest<{ user_id: number }>("POST", "/api/auth/email-find", { email });

    if (!data || error) {
      setError(error || "비밀번호 찾기 실패");
      setLoading(false);
      return;
    }

    setLoading(false);

    sessionStorage.setItem("email", email);
    router.push(`/auth/email-verification?type=email-find`);
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
            <h1 className="text-center text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2lg dark:text-white">비밀번호 찾기</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  이메일
                </label>
                <input
                  autoComplete="email"
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="이메일"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className={`w-full text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  style={{ height: 35 }}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : "비밀번호 찾기"}
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

export default FindPasswordFormPage;
