import { getCategoryData } from "@components/constant/getCategoryData";
import getFormatRelativeTime from "@components/constant/getFormatRelativeTime";
import Breadcrumb from "@components/Layout/Breadcrumb";
import CommentReplyForm from "@components/Layout/CommentReplyForm";
import CommentSection from "@components/Layout/CommentSection";
import Divider from "@components/Layout/Divider";
import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import ReportModal from "@components/Modal/ReportModal";
import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaBookmark, FaExclamationTriangle, FaHeart, FaThumbsDown } from "react-icons/fa"; // 신고 아이콘 추가

export interface PostProps {
  user: Session["user"] | null;
  post: {
    post_id: number;
    title: string;
    content: string;
    author: string;
    author_profile: string;
    author_level: number;
    category: string;
    created_at: string;
    view_count: number;
    like_count: number;
    is_bookmark: 0 | 1; // 북마크 여부
    is_like: 0 | 1; // 좋아요 여부
    is_dislike: 0 | 1; // 싫어요 여부
  };
  commentList: Array<{
    comment_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    author: string;
    author_profile: string;
    author_level: number;
    parent_comment_id: number | null;
  }>;
}

const PostDetail = ({ user, post: initialPost, commentList: initialCommentList }: PostProps) => {
  const router = useRouter();
  const [post, setPost] = useState(initialPost); // post를 상태로 관리
  const [commentList, setCommentList] = useState(initialCommentList); // post를 상태로 관리
  const category = getCategoryData(post.category);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 팝업 상태

  useEffect(() => {
    if (!user) {
      alert("게시글을 보려면 로그인이 필요합니다");
      router.push(`/auth/signin?redirect=${router.asPath}`);
    }
  }, [user]);

  const handleRecommend = async (type: "like" | "dislike" | "bookmark", value: 0 | 1) => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    const { data, error } = await apiRequest<any>(value ? "DELETE" : "POST", `/api/post/${type}`, { user_id: user.id, post_id: post.post_id });
    if (error) return alert("서버요청에 실패했습니다." + error);

    // 서버 응답에서 새로운 post 데이터를 받아서 상태 갱신

    setPost({ ...post, ...data }); // post 상태 업데이트
  };

  const handleReport = () => {
    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");
    // 신고 버튼 클릭 시 팝업 열기
    setIsReportModalOpen(true);
  };

  const onCommentSubmit = async (content: string) => {
    if (!user || !user.id) {
      alert("로그인이 필요한 기능입니다");
      return false;
    }

    const { data, error } = await apiRequest<any>("POST", `/api/post/comment`, { user_id: user.id, post_id: post.post_id, content });
    if (error) {
      alert("서버요청에 실패했습니다." + error);
      return false;
    }

    // 서버 응답에서 새로운 comment 데이터를 받아서 상태 갱신
    alert("댓글이 성공적으로 등록되었습니다!");
    setCommentList(data); // comment 상태 업데이트
    return true;
  };

  if (!user)
    return (
      <div>
        <Header user={user} />
        <div css={pageStyle}></div>
      </div>
    );
  return (
    <div>
      <Header user={user} />
      <div css={pageStyle}>
        {/* 내용 */}
        <div className="pl-4">
          <Divider disableIcon />
          <Breadcrumb menuData={[...category.menuData, { name: `${post.post_id}`, href: `/post/${post.post_id}` }]} />
          <div css={titleWrapper}>
            <h1 css={titleStyle}>{post.title}</h1>
            <button css={reportButtonStyle} onClick={handleReport}>
              <FaExclamationTriangle className="focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" style={{ marginRight: "8px", color: "gray", fontSize: 12 }} />
              신고하기
            </button>
          </div>
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <img
                onClick={() => router.push(`/user/${post.author}`)}
                src={post.author_profile}
                alt={`${post.author}의 프로필`}
                className={`w-8 h-8 rounded-full mr-3 overflow-hidden ${post.author ? "cursor-pointer" : ""}`}
                onError={(e) => (e.currentTarget.src = "/default-profile.png")}
              />
              <div>
                <p className={`text-sm font-medium ${post.author ? "cursor-pointer" : ""}`} onClick={() => router.push(`/user/${post.author}`)}>
                  {post.author}
                </p>
                <p className="text-xs text-gray-500">
                  레벨 {post.author_level} | {getFormatRelativeTime(post.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-sm text-right text-gray-600">조회수: {post.view_count}</div>
            </div>
          </div>

          <div css={contentStyle}>{post.content}</div>

          <div css={recommendOutWrapper}>
            <div css={recommendWrapper}>
              <button css={recommendButtonStyle} className="focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" onClick={() => handleRecommend("like", post.is_like)}>
                <FaHeart style={{ marginRight: 2, color: post.is_like ? "red" : "#a0a0a0" }} /> 좋아요
              </button>
              <button css={recommendButtonStyle} className="focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" onClick={() => handleRecommend("dislike", post.is_dislike)}>
                <FaThumbsDown style={{ marginRight: 2, color: post.is_dislike ? "black" : "#a0a0a0" }} /> 비추
              </button>
              <button css={recommendButtonStyle} className="focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" onClick={() => handleRecommend("bookmark", post.is_bookmark)}>
                <FaBookmark style={{ marginRight: 2, color: post.is_bookmark ? "rgb(250, 202, 21)" : "#a0a0a0" }} /> 즐겨찾기
              </button>
            </div>
          </div>
          <div className="mt-6 mb-4">{post.like_count ? <p css={recommendTextStyle}>{post.like_count}명이 이 글을 추천합니다!</p> : null}</div>
          <Divider />
          {/* 대댓글 */}
          <CommentSection user={user} postId={post.post_id} commentList={commentList} setCommentList={setCommentList} />
          <CommentReplyForm onSubmit={onCommentSubmit} />
        </div>
      </div>
      <Footer />
      {/* 신고 팝업 */}
      <ReportModal user={user} postId={post.post_id} isHidden={!isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const post_id = context.params!.id;

  // 세션 체크
  const session = await getSession({ req: context.req });

  let commentList = [];
  try {
    const { data, error } = await apiRequest<any>("GET", "/api/post/id", { post_id, user_id: session?.user.id });
    if (error) throw Error(error);

    // 댓글 리스트를 가져오는 API 호출
    if (session?.user.id) {
      const { data: commentData, error: commentError } = await apiRequest<any>("GET", "/api/post/comment", { post_id, user_id: session.user.id });
      if (commentError) throw Error(commentError);
      commentList = commentData;
    }

    return { props: { user: session?.user || null, post: data, commentList } };
  } catch (error) {
    console.error("게시글 가져오기 실패:", error);
    return { notFound: true };
  }
};

export default PostDetail;

const pageStyle = css`
  padding: 150px 20px 100px 20px;
  text-align: left;
`;

const titleWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const titleStyle = css`
  font-size: 2.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  word-break: break-all;
`;

const reportButtonStyle = css`
  margin-left: 16px;
  margin-top: 12px;
  margin-bottom: auto;
  border: 1px solid #ddd;
  padding: 8px 16px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  color: #3f3f3f;
  font-weight: 200;

  &:hover {
    background-color: #f3f3f3;
  }
`;

const contentStyle = css`
  font-size: 1.1rem;
  color: #444;
  line-height: 1.6;
  white-space: pre-line;
  padding: 0 20px;
`;

const recommendOutWrapper = css`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const recommendWrapper = css`
  display: flex;
  justify-content: space-around;
  gap: min(15px, 4vw);
  margin-top: 60px;
`;

const recommendButtonStyle = css`
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  padding: 8px 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  color: #1b1b1b;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f3;
  }
`;

const recommendTextStyle = css`
  text-align: center;
  font-size: 1rem;
  color: #666;
`;
