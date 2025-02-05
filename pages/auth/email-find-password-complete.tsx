import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const FindPasswordCompletePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const tempPassword = sessionStorage.getItem("tempPassword");
    if (!email || !tempPassword) {
      setError("유효하지 않은 경로입니다.\n비밀번호를 다시 찾으려면 메일 재인증 후 다시 이용해주세요.");
      setIsLoading(false);
      return;
    }
    setEmail(email);
    setTempPassword(tempPassword);
    setIsLoading(false);
  }, []);

  const handleHome = () => {
    router.push("/auth/signin");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    alert("임시 비밀번호가 복사되었습니다.");
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
            <h1 className="text-center text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2lg dark:text-white">비밀번호 재설정 완료</h1>
            <div className="space-y-4 md:space-y-6">
              <div className="relative">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  이메일
                </label>
                <div className="relative">
                  <input
                    readOnly
                    disabled={isLoading}
                    className="bg-gray-200 border border-gray-400 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-12 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="이메일"
                    value={email}
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="tempPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  임시 비밀번호
                </label>
                <div className="relative">
                  <input
                    readOnly
                    disabled={isLoading}
                    className="bg-gray-200 border border-gray-400 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-12 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="임시 비밀번호"
                    value={tempPassword}
                  />
                  <button
                    disabled={isLoading}
                    type="button"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm px-2 py-1 rounded-md ${
                      isLoading ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline dark:text-blue-500"
                    }`}
                    onClick={handleCopy}
                  >
                    복사
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <div className="pt-8">
                <button
                  disabled={isLoading}
                  onClick={handleHome}
                  type="button"
                  className={`w-full flex items-center justify-center text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  style={{ height: 35 }}
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : "로그인하기"}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center" style={{ marginTop: 10 }}>
                임시 비밀번호는 로그인 후 반드시 변경해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindPasswordCompletePage;
