import apiRequest from "@utils/api";
import { useState } from "react";
import { Session } from "next-auth";
const ProfilePictureModal = ({
  user,
  currentProfilePicture,
  onClose,
  onChangeCurrentProfilePicture,
  isHidden = false,
}: {
  user: Session["user"] | null;
  currentProfilePicture: string;
  onClose: () => void;
  onChangeCurrentProfilePicture: (profilePicture: string) => void;
  isHidden?: boolean;
}) => {
  const [profileText, setProfileText] = useState<string>(currentProfilePicture === "/default-profile.png" ? "" : currentProfilePicture);

  const onSubmit = async () => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    if (!currentProfilePicture.trim()) return alert("변경할 프로필 이미지 URL을 입력해주세요.");

    // 프로필 이미지 URL을 서버로 전송하는 API 호출
    const { data, error } = await apiRequest<any>("PATCH", "/api/user/profile/picture", { user_id: user.id, profile_picture: profileText });

    if (error) return alert("프로필 이미지 변경에 실패했습니다. " + error);

    alert("프로필 이미지가 성공적으로 변경되었습니다!");
    // 프로필 이미지 URL 업데이트
    onChangeCurrentProfilePicture(profileText);

    onClose();
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
            <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">프로필 이미지 URL 변경</h3>

            {/* 프로필 이미지 미리보기 */}
            <div className="mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border border-gray-400">
                <img src={profileText} alt="Profile Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/default-profile.png")} />
              </div>
            </div>

            {/* 텍스트 입력창 (URL) */}
            <div className="mb-8 text-left">
              <input
                type="text"
                value={profileText}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="변경할 프로필 이미지 URL을 입력해주세요"
                onChange={(e) => setProfileText(e.target.value)}
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

              {/* 이미지 변경 버튼 */}
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

export default ProfilePictureModal;
