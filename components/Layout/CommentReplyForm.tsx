import getEmojiList, { EmojiListType } from "@components/constant/getEmojiList";
import { useRef, useState } from "react";

interface CommentReplyFormProps {
  onSubmit: (comment: string) => Promise<boolean>;
}

const CommentReplyForm: React.FC<CommentReplyFormProps> = ({ onSubmit }) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState<boolean>(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<EmojiListType>("표정"); // 초기 카테고리

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (commentRef.current) commentRef.current.requestFullscreen().catch((err) => console.error("Failed to enter fullscreen", err));
    } else document.exitFullscreen().catch((err) => console.error("Failed to exit fullscreen", err));
  };

  const handleCategoryChange = (category: EmojiListType) => {
    setSelectedCategory(category); // 카테고리 변경
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentRef.current) return;
    const comment = commentRef.current.value;
    if (!comment.trim()) return alert("댓글 내용을 입력해주세요");

    const result = await onSubmit(comment);
    if (result === true) commentRef.current.value = "";
  };

  const handleEmojiClick = (emoji: string) => {
    if (!commentRef.current) return;
    commentRef.current.value += emoji;
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => !prev);
  };

  return (
    <form>
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600 border-gray-200">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
            <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
              {/* <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                  <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6" />
                </svg>
                <span className="sr-only">파일 첨부</span>
              </button> */}
              {/* <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                  <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                <span className="sr-only">지도 삽입</span>
              </button> */}
              {/* <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
                <span className="sr-only">이미지 첨부</span>
              </button> */}
              <button
                onClick={toggleEmojiPicker}
                type="button"
                className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                </svg>
                <span className="sr-only">이모지 추가</span>
              </button>
              {isEmojiPickerVisible && (
                <div className="absolute bg-white p-2 border rounded-lg shadow-md mt-[-180px]">
                  {/* 헤더 부분: 닫기 버튼 */}
                  <div className="pr-2 flex justify-between items-center">
                    <div className="font-bold">이모지 선택</div> {/* 카테고리 제목 */}
                    <button
                      type="button"
                      onClick={() => setIsEmojiPickerVisible(false)} // 상태 변경 함수로 닫기
                      className="text-xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  {/* 카테고리 버튼들 */}
                  <div className="flex mt-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("표정")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "표정" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      표정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("제스쳐")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "제스쳐" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      제스쳐
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("동물")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "동물" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      동물
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("음식")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "음식" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      음식
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("날씨")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "날씨" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      날씨
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("교통")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "교통" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      교통
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("사물")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "사물" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      사물
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("심볼")}
                      className={`px-1 py-1 rounded-full text-xs border ${selectedCategory === "심볼" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"} hover:bg-blue-100`}
                    >
                      심볼
                    </button>
                  </div>

                  {/* 이모지 그리드 부분 */}
                  <div className="mt-2">
                    <div className="grid grid-cols-8 gap-2 p-2 max-h-[80px] overflow-y-auto">
                      {getEmojiList(selectedCategory).map((emoji, index) => (
                        <button key={index} type="button" onClick={() => handleEmojiClick(emoji)} className="text-xl cursor-pointer">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
              <button type="button" className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                </svg>
                <span className="sr-only">Settings</span>
              </button>
            </div> */}
          </div>
          <button
            onClick={toggleFullScreen}
            type="button"
            data-tooltip-target="tooltip-fullscreen"
            className="p-2 text-gray-500 rounded-sm cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 19">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
              />
            </svg>
            <span className="sr-only">전체화면</span>
          </button>
          <div
            id="tooltip-fullscreen"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
          >
            전체화면으로 보기
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
          <label htmlFor="editor" className="sr-only">
            댓글작성
          </label>
          <textarea
            ref={commentRef}
            id="editor"
            rows={4}
            className="block w-full px-0 text-lg text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder="여기에 댓글 내용을 입력하세요"
            required
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          type="submit"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gray-900 rounded-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-blue-900 hover:bg-gray-800"
        >
          댓글작성
        </button>
      </div>
    </form>
  );
};

export default CommentReplyForm;
