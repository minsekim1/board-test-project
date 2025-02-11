import apiRequest from "@utils/api";
import { Dispatch, SetStateAction, useState } from "react";
  import { Session } from "next-auth";

const ReplyModal = ({
  user,
  postId,
  commentId,
  isHidden = false,
  onClose,
  setCommentList,
}: {
  user: Session["user"] | null;
  postId: number;
  commentId: number | null;
  isHidden?: boolean;
  onClose: () => void;
  setCommentList: Dispatch<
    SetStateAction<
      {
        comment_id: number;
        user_id: number;
        content: string;
        created_at: string;
        updated_at: string;
        author: string;
        author_profile: string;
        author_level: number;
        parent_comment_id: number | null;
      }[]
    >
  >;
}) => {
  const [replyContent, setReplyContent] = useState<string>("");

  const onSubmit = async () => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    if (!replyContent.trim()) return alert("답글내용을 입력해주세요.");

    // 신고 처리 API 호출
    const { data, error } = await apiRequest<any>("POST", "/api/post/comment", { user_id: user.id, parent_comment_id: commentId, post_id: postId, content: replyContent });
    if (error) return alert("대댓글 등록에 실패했습니다." + error);

    // 데이터 갱신
    setCommentList(data);

    setReplyContent("");

    alert("대댓글이 성공적으로 등록되었습니다!");
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
            <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">댓글 등록</h3>

            {/* 입력창 */}
            <div className="mb-4 text-left">
              <textarea
                id="custom-reason"
                name="custom-reason"
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="여기에 댓글 내용을 입력해주세요"
              ></textarea>
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
                완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
