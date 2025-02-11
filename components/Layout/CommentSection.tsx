import getFormatRelativeTime from "@components/constant/getFormatRelativeTime";
import ReplyModal from "@components/Modal/ReplyModal";
import ReportCommentModal from "@components/Modal/ReportCommentModal";
import { css } from "@emotion/react";
import { PostProps } from "@pages/post/[id]";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

interface CommentProps {
  user: Session["user"] | null;
  postId: number;
  commentList: PostProps["commentList"];
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
}
const CommentSection = ({ user, commentList, postId, setCommentList }: CommentProps) => {
  const router = useRouter();
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); // 대댓글 팝업 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 팝업 상태

  const onClickReplyComment = (commentId: number) => {
    setIsReplyModalOpen(true);
    setSelectedCommentId(commentId);
  };
  const onClickReportComment = (commentId: number) => {
    setIsReportModalOpen(true);
    setSelectedCommentId(commentId);
  };

  return (
    <div css={commentSectionStyle}>
      <div id="comment" className="text-lg font-semibold text-gray-800 mb-3">
        Comments
      </div>
      {!user ? (
        <div className="text-sm text-gray-800 mb-3">로그인 후 댓글을 확인할 수 있습니다</div>
      ) : commentList.length === 0 ? (
        <div className="text-sm text-gray-800 mb-3">댓글이 없습니다</div>
      ) : (
        commentList.map((comment) => (
          <div key={comment.comment_id} css={commentWrapperStyle} className={comment.parent_comment_id ? "ml-10" : undefined}>
            <div css={commentHeaderStyle}>
              <div css={headerLeftStyle}>
                <img
                  onClick={() => router.push(`/user/${comment.author}`)}
                  className={`${comment.author ? "cursor-pointer" : ""}`}
                  src={comment.author_profile}
                  alt={`${comment.author}의 프로필`}
                  css={profileImageStyle}
                />
                <div>
                  <p onClick={() => router.push(`/user/${comment.author}`)} className={`${comment.author ? "cursor-pointer" : ""}`} css={nicknameStyle}>
                    {comment.author}
                  </p>
                  <p css={userInfoStyle}>
                    레벨 {comment.author_level} | {getFormatRelativeTime(comment.created_at)}
                  </p>
                </div>
              </div>
              <div css={buttonGroupStyle}>
                {comment.parent_comment_id === null && (
                  <button css={actionButtonStyle} onClick={() => onClickReplyComment(comment.comment_id)}>
                    답글
                  </button>
                )}
                <button css={reportButtonStyle} onClick={() => onClickReportComment(comment.comment_id)}>
                  신고
                </button>
              </div>
            </div>
            <p css={contentStyle}>{comment.content}</p>
          </div>
        ))
      )}
      {/* 대댓글 팝업 */}
      <ReplyModal user={user} setCommentList={setCommentList} postId={postId} commentId={selectedCommentId} isHidden={!isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} />
      {/* 신고 팝업 */}
      <ReportCommentModal user={user} commentId={selectedCommentId} isHidden={!isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};
const headerLeftStyle = css`
  display: flex;
  align-items: center;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 10px;
`;

const actionButtonStyle = css`
  font-size: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const reportButtonStyle = css`
  font-size: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const commentHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
`;
const commentSectionStyle = css`
  margin-top: 20px;
  padding: 20px 0;
`;

const commentWrapperStyle = css`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const profileImageStyle = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const nicknameStyle = css`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 2px;
`;

const userInfoStyle = css`
  font-size: 0.85rem;
  color: #666;
`;

const contentStyle = css`
  font-size: 1.1rem;
  color: #444;
  line-height: 1.5;
`;

export default CommentSection;
