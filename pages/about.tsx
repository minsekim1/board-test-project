import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import { css } from "@emotion/react";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export default function About({ user }: { user: Session["user"] | null }) {
  return (
    <div>
      <Header user={user} />
      <div css={PageStyle}>
        <div className="max-w-3xl mx-auto p-6 text-gray-800">
          <h1 className="text-3xl font-bold text-center mb-6">Board Test Project란?</h1>
          <p className="text-lg leading-relaxed mb-4">Board Test Project는 테스트용 게시판 프로젝트입니다.</p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">주요 기능</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>익명 게시판을 통해 자유로운 의견 교환</li>
            <li>실시간 채팅 기능 제공</li>
            <li>첨부 파일 및 이미지 공유 가능</li>
            <li>트위터, 이메일을 통한 간편 회원가입</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-2">우리의 목표</h2>
          <p className="leading-relaxed mb-4">우리는 유저들에게 유익한 기능을 제공함으로써 수익을 창출하고, 지속 가능하고 즐거운 커뮤니티를 운영하는 것을 목표로 합니다.</p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">문의</h2>
          <p className="leading-relaxed">
            궁금한 사항이 있으시면 언제든지{" "}
            <a href="mailto:test@gmail.com" className="text-blue-500">
              test@gmail.com
            </a>
            로 연락해 주세요.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  return {
    props: {
      user: session?.user || null,
    },
  };
};

const PageStyle = css`
  padding: 50px 20px 100px 20px;
`;
