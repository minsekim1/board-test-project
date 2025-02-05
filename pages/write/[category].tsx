import { getCategoryData } from "@components/constant/getCategoryData";
import Divider from "@components/Layout/Divider";
import Editor from "@components/Layout/Editor";
import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";

const WritePage = ({ user }: { user: Session["user"] | null }) => {
  const router = useRouter();
  const { category } = router.query; // 동적 경로에서 category 값 추출
  const { title, menuData } = getCategoryData(category);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const onWriteComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) return alert("로그인이 필요한 기능입니다");

    const title = titleRef.current?.value;
    const content = contentRef.current?.value;

    if (!title || !content) return alert("제목과 내용을 모두 입력해주세요.");

      const { data, error } = await apiRequest<any>("POST", "/api/post", { user_id: user.id, title, category, content });
    if (error) return alert("게시글 작성에 실패했습니다." + error);

    alert("게시글이 작성되었습니다.");
    window.location.href = `/post/${data.post_id}`;
  };

  const handleContentChange = (event: any) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div>
      <Header user={user}/>
      <div css={PageStyle}>
        <h1 className="font-bold text-xl mt-2">{title} 글쓰기</h1>
        <p className="mt-4">
          - 게시글 작성을 완료하려면 아래의 내용을 입력한 후 "글쓰기" 버튼을 클릭하세요.
          <br />- 부적절한 내용이나 욕설이 포함된 게시글은 삭제될 수 있습니다.
        </p>

        <Divider disableIcon />
        <form onSubmit={onWriteComplete} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <input ref={titleRef} type="text" id="title" className="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="게시글 제목을 입력하세요" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              내용
            </label>
            {/* <Editor /> */}
            <textarea
              ref={contentRef}
              id="content"
              onChange={handleContentChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md resize-none overflow-y-hidden"
              rows={6}
              placeholder="게시글 내용을 입력하세요"
            />
          </div>
          <div className="w-full flex justify-end mt-8">
            <button onClick={onWriteComplete} className="text-white bg-blue-900 px-4 py-2 rounded-md hover:bg-blue-800">
              글쓰기
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 세션이 없다면 로그인 페이지로 리다이렉트
  const session = await getSession({ req: context.req });
  if (!session) return { redirect: { destination: "/auth/signin", permanent: false } };

  return {
    props: {
      user: session.user || null,
    },
  };
};

export default WritePage;

const PageStyle = css`
  padding: 150px 20px 100px 20px;
`;
