import apiRequest from "@utils/api";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const NicknameModal = ({
  user,
  currentNickName,
  onClose,
  onChangeCurrentNickname,
  isHidden = false,
}: {
  user: Session["user"] | null;
  currentNickName: string;
  onClose: () => void;
  onChangeCurrentNickname: (nickname: string) => void;
  isHidden?: boolean;
  }) => {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>(currentNickName);


  const onSubmit = async () => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    if (!nickname.trim()) return alert("변경할 닉네임을 입력해주세요.");
    if (nickname === currentNickName) return alert("현재 동일한 닉네임입니다.");

    // 신고 처리 API 호출
    const { data, error } = await apiRequest<any>("PATCH", "/api/user/profile/nickname", { user_id: user.id, nickname: nickname });
    if (error) return alert("닉네임 변경에 실패했습니다. " + error);

    alert("닉네임이 성공적으로 변경되었습니다!\n닉네임 변경은 다시 로그인이 필요합니다.");

    onChangeCurrentNickname(nickname);

    setNickname("");
    onClose();

    router.push(`/auth/signin?redirect=/user/${nickname}`);
   
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
            <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">닉네임 변경</h3>

            {/* 입력창 */}
            <div className="mb-8 text-left">
              <input
                id="custom-nickname"
                name="custom-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="변경할 닉네임을 입력해주세요 (최대 10자)"
                maxLength={10}
              />
            </div>

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
                onClick={onSubmit}
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

export default NicknameModal;
