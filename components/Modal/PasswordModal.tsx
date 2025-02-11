import apiRequest from "@utils/api";
import { Session } from "next-auth";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const PasswordModal = ({ user, isHidden = false, onClose }: { user: Session["user"] | null; isHidden?: boolean; onClose: () => void }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const { data, error } = await apiRequest<{ data: string }>("PATCH", "/api/user/profile/password", { user_id: user?.id, password, new_password: newPassword });
    if (error) {
      console.error("비밀번호 변경 실패:", error);
      setError(error);
      return;
    }
    onClose();

    setPassword("");
    setNewPassword("");
  };

  return (
    <div id="popup-modal" tabIndex={-1} className={`${isHidden ? "hidden" : ""} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* 모달 닫기 버튼 */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <div className="p-4 md:p-5 text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">비밀번호 변경</h3>

            {/* 입력창 */}
            <div className="mb-8 text-left">
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
                  className="border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300 px-2" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
						</div>
						
            {/* 새비밀번호 입력창 */}
            <div className="mb-8 text-left">
              <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                새 비밀번호
              </label>
              <div className="relative">
                <input
                  autoComplete="new-password"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="••••••••"
                  className="border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300 px-2" onClick={() => setShowNewPassword((p) => !p)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

           
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex items-center justify-between space-x-4 mt-4">
              {/* 취소 버튼 */}
              <button
                onClick={onClose}
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                취소
              </button>

              {/* 댓글등록 버튼 */}
              <button
                onClick={handleSubmit}
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
