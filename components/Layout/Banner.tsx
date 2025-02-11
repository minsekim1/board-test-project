import { HTMLAttributes } from "react";

const Banner = ({ className }: { className: string | undefined }) => {
  return (
    <div className={`relative bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center p-8 rounded-xl shadow-lg ${className || ""}`}>
      <h1 className="text-4xl font-bold">Board Test Project</h1>
      <p className="mt-2 text-lg">테스트용 게시판 프로젝트입니다.</p>
      <a href="/about" className="mt-4 inline-block bg-white text-blue-500 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition">
        더 알아보기
      </a>
    </div>
  );
};

export default Banner;