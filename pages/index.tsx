import Banner from "@components/Layout/Banner";
import Divider from "@components/Layout/Divider";
import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import Tab from "@components/Layout/Tab";
import Table from "@components/Layout/Table";
import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

type PostType = {
  id: number;
  title: string;
  author: string;
  author_level: number;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
};
type IndexPagePostType = {
  user: Session["user"] | null;
  cookie: any;
  post: {
    hotList: PostType[];
    recentList: PostType[];
    bookmarkList: PostType[];
    noticeList: PostType[];
    freeList: PostType[];
    buyList: PostType[];
    galleryList: PostType[];
    ssulList: PostType[];
    voteList: PostType[];
    introList: PostType[];
    newPostList: PostType[];
    newCommentList: PostType[];

  };
};
const IndexPage = ({ post, user, cookie }: IndexPagePostType) => {
  const router = useRouter();

  return (
    <div>
      <Header user={user} />
      <div css={PageStyle}>
        <Banner className="mb-24" />

        <Tab tabData={[{ name: "핫이슈/추천" }, { name: "최근본게시물" }, { name: "즐겨찾기", listHref: "/board/bookmark" }, { name: "공지사항", listHref: "/board/notice" }]}>
          {post.hotList.length > 0 ? <Table hiddenHeader list={post.hotList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
          {post.recentList.length > 0 ? <Table hiddenHeader list={post.recentList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>최근 본 게시글이 없습니다.</div>}
          {post.bookmarkList.length > 0 ? <Table hiddenHeader list={post.bookmarkList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>즐겨찾기가 없습니다.</div>}
          {post.noticeList.length > 0 ? <Table hiddenHeader list={post.noticeList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>공지사항이 없습니다.</div>}
        </Tab>

        <Divider />

        <Tab
          tabData={[
            { name: "자유게시판", listHref: "/board/free", writeHref: "/write/free" },
            { name: "중고거래게시판", listHref: "/board/buy", writeHref: "/write/buy" },
          ]}
        >
          {post.freeList.length > 0 ? <Table hiddenHeader list={post.freeList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
          {post.buyList.length > 0 ? <Table hiddenHeader list={post.buyList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
        </Tab>

        <Divider />


        <Divider />

        <Tab
          tabData={[
            { name: "갤러리", listHref: "/board/gallery", writeHref: "/write/gallery" },
            { name: "문서", listHref: "/board/document", writeHref: "/write/document" },
            { name: "투표/설문", listHref: "/board/vote", writeHref: "/write/vote" },
          ]}
        >
          {post.galleryList.length > 0 ? <Table hiddenHeader list={post.galleryList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
          {post.ssulList.length > 0 ? <Table hiddenHeader list={post.ssulList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
          {post.voteList.length > 0 ? <Table hiddenHeader list={post.voteList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
        </Tab>

        <Divider />

        <Tab tabData={[{ name: "가입인사", listHref: "/board/intro", writeHref: "/write/intro" }]}>
          {post.introList.length > 0 ? <Table hiddenHeader list={post.introList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>게시글이 없습니다.</div>}
        </Tab>

        <Divider />

        <Tab tabData={[{ name: "새 게시물" }, { name: "새 댓글" }]}>
          {post.newPostList.length > 0 ? <Table hiddenHeader list={post.newPostList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>새 게시글이 없습니다.</div>}
          {post.newCommentList.length > 0 ? <Table hiddenHeader list={post.newCommentList} onClickRow={(id) => router.push(`/post/${id}`)} /> : <div>새 댓글이 없습니다.</div>}
        </Tab>
      </div>
      <Footer />
    </div>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 세션 체크
  const session = await getSession({ req: context.req });

  const { data, error } = await apiRequest<any>("GET", "/api/post/home", { user_id: session?.user.id });
  if (error) {
    console.error("홈 조회 실패:", error);
    return { notFound: true }; // 에러 발생 시 404 페이지로 이동
  }
  return { props: { post: data, user: session?.user || null, cookie: context.req.cookies } };
};

const PageStyle = css`
  padding: 50px 20px 100px 20px;
`;
