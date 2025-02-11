import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { Session } from "next-auth";
import { useState } from "react";

const ReportModal = ({
  user,
  postId,
  isHidden = false,
  onClose,
}: {
  user: Session["user"] | null;
  postId: number;
  isHidden?: boolean;
  onClose: () => void;
}) => {

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleChangeReason = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
    if (event.target.value !== "custom") {
      setCustomReason("");
    }
  };

  const onSubmit = async () => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    if (!selectedReason) return alert("신고 사유를 선택하거나 입력해주세요.");
    if (selectedReason === "custom" && !customReason) return alert("신고 사유를 입력해주세요.");
    const reason = customReason || selectedReason;

    // 신고 처리 API 호출
    const { error } = await apiRequest<any>("POST", "/api/post/report", { user_id: user.id, post_id: postId, report_reason: reason });
    if (error) return alert("신고에 실패했습니다." + error);

    setSelectedReason("");
    setCustomReason("")

    alert("신고가 접수되었습니다.");
    onClose(); // 팝업 닫기
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
            <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">신고하기</h3>

            {/* 신고 사유 선택 */}
            <div className="mb-4 text-left">
              <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                신고 사유
              </label>
              <select
                id="reason"
                name="reason"
                value={selectedReason}
                onChange={handleChangeReason}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">선택해주세요</option>
                <option value="스팸">스팸</option>
                <option value="괴롭힘">괴롭힘</option>
                <option value="부적절한 내용">부적절한 내용</option>
                <option value="허위 정보">허위 정보</option>
                <option value="custom">직접 입력</option>
              </select>
            </div>

            {/* 직접 입력이 선택되었을 때만 나타나는 입력창 */}
            {selectedReason === "custom" && (
              <div className="mb-4 text-left">
                <label htmlFor="custom-reason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  직접 입력
                </label>
                <textarea
                  id="custom-reason"
                  name="custom-reason"
                  rows={4}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="신고 사유를 입력해주세요."
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-between space-x-4 mt-4">
              {/* 신고하기 버튼 */}
              <button
                onClick={onSubmit}
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                신고하기
              </button>

              {/* 취소 버튼 */}
              <button
                onClick={onClose}
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReportModal;
