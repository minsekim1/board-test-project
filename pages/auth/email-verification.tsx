import NumberInput from "@components/Layout/NumberInput";
import apiRequest from "@utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

const VerifyRequestPage = () => {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | "info" | null>(null);

  const router = useRouter(); // useRouter 훅을 사용해 리다이렉트 할 수 있음

  const resendVerificationCode = async () => {
    setIsSending(true);
    setMessage(null); // 기존 메시지 초기화
    setMessageType(null); // 메시지 유형 초기화

    const email = sessionStorage.getItem("email");

    if (!email) {
      setMessage("잘못된 경로입니다.");
      setMessageType("error");
      setIsSending(false);
      return;
    }

    const { data, error } = await apiRequest<{ data: string }>("POST", "/api/auth/email", { email, type: router.query.type });

    if (error) {
      console.error("이메일 인증 코드 재발송 실패:", error);
      setMessage(error);
      setMessageType("error");
      setIsSending(false);
      return;
    }

    setIsSending(false);
  };

  const handleSubmit = async (code: string) => {
    setIsSending(true);
    setMessage(null); // 기존 메시지 초기화
    setMessageType(null); // 메시지 유형 초기화

    const email = sessionStorage.getItem("email");
    if (!email) {
      setMessage("잘못된 경로입니다.");
      setMessageType("error");
      setIsSending(false);
      return;
    }

    const { data, error } = await apiRequest<string>("PATCH", "/api/auth/email", { email, code, type: router.query.type });

    if (error) {
      setMessage(error);
      setMessageType("error");
      setIsSending(false);
      return;
    }

    // 화면전환 (회원가입 폼)
    if (router.query.type === "email-find" && data) {
      sessionStorage.setItem("tempPassword", data);
      const url = `/auth/email-find-password-complete`;
      router.replace(url);
    } else {
      const url = router.query.redirect ? `/auth/signup-form?redirect=${encodeURIComponent(`${router.query.redirect}`)}` : "/auth/signup-form";
      router.replace(url);
    }

    setIsSending(false);
  };

  const getMessageClass = () => {
    if (messageType === "error") return "text-sm text-red-500 mt-2";
    if (messageType === "success") return "text-sm text-green-500 mt-2";
    if (messageType === "info") return "text-sm text-blue-500 mt-2";
    return "";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">이메일 인증 요청</h1>

        <div className="text-center text-gray-700 mb-6">
          <p className="mb-2">이메일로 인증 코드가 전송되었습니다!</p>
          <p className="mb-2">이메일에서 받은 인증 코드를 입력하여 인증을 완료해주세요.</p>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">6자리 인증 코드를 입력해주세요:</p>
          <div className="w-full max-w-xs mx-auto">
            <NumberInput onSubmit={handleSubmit} />
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>
            인증 코드가 없으신가요?{" "}
            <button onClick={resendVerificationCode} disabled={isSending} className="text-blue-600 hover:underline">
              {isSending ? "재전송 중..." : "다시 보내기"}
            </button>
          </p>

          {message && <p className={getMessageClass()}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyRequestPage;
