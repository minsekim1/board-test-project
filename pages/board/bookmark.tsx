import Breadcrumb from "@components/Layout/Breadcrumb";
import Divider from "@components/Layout/Divider";
import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import Table from "@components/Layout/Table";
import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getCategoryData } from "../../components/constant/getCategoryData";
import { Session } from "next-auth";

// 페이지네이션 타입
interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// 게시글 타입
interface Post {
  id: number;
  title: string;
  author: string;
  created_at: string;
  is_updated: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
}

// BoardPage 컴포넌트 props 타입
interface BookmarkPageProps {
  user: Session["user"] | null;
  posts: Post[]; // 게시글 목록
  pagination: Pagination; // 페이지네이션 정보
  category: string; // 카테고리
  title: string; // 카테고리 제목
  menuData: any; // 카테고리 관련 메뉴 데이터
  titleDesc: string; // 카테고리 설명
}

const BookmarkPage = ({ user, posts, pagination, category, title, menuData, titleDesc }: BookmarkPageProps) => {
  const router = useRouter();

  const onPageChange = (newPage: number) => {
    router.push({ pathname: `/board/${category}`, query: { page: newPage, size: pagination.size } });
  };

  return (
    <div>
      <Header user={user} />
      <div css={PageStyle}>
        <div className="pl-4">
          <Breadcrumb menuData={menuData} />
          <h1 className="font-bold text-xl mt-2">{title}</h1>
          <p className="mt-4">{titleDesc}</p>
          <Divider disableIcon />
          {/* <h1 className="font-bold text-xl mt-8">TOP 5</h1>
        <Table list={[]}/> */}
          <h1 className="font-bold text-xl mt-8">전체글</h1>
          <Table list={posts} onClickRow={(id) => (window.location.href = `/post/${id}`)} />

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8 items-center">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md mr-8 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-100"
            >
              이전
            </button>
            <span>
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md ml-8 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-100"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookmarkPage;

export const getServerSideProps: GetServerSideProps = async (context) => {

  // 로그인 여부 확인
  const session = await getSession({ req: context.req });
  if (!session?.user) return { redirect: { destination: "/auth/signin", permanent: false } };

  const { page = 1, size = 10 } = context.query; // 쿼리 파라미터에서 page와 size를 받음
  const { data, error } = await apiRequest<any>("GET", "/api/post/bookmark", { page: Number(page), size: Number(size), user_id: session.user.id });

  const category = "bookmark";
  if (error) {
    console.error("게시글 목록 조회 실패:", error);
    return { notFound: true }; // 에러 발생 시 404 페이지로 이동
  }

  const { title, menuData, titleDesc } = getCategoryData(category);

  return {
    props: {
      user: session.user,
      posts: data.list || [],
      pagination: {
        page: Number(page),
        size: Number(size),
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / Number(size)) || 1,
      },
      category,
      title,
      menuData,
      titleDesc,
    },
  };
};

const PageStyle = css`
  padding: 150px 20px 100px 20px;
`;
