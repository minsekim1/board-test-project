import Breadcrumb from "@components/Layout/Breadcrumb";
import Divider from "@components/Layout/Divider";
import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";
import Table from "@components/Layout/Table";
import NicknameModal from "@components/Modal/NicknameModal";
import PasswordModal from "@components/Modal/PasswordModal";
import ProfilePictureModal from "@components/Modal/ProfilePictureModal";
import { css } from "@emotion/react";
import apiRequest from "@utils/api";
import { GetServerSideProps } from "next";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineComment, AiOutlineEye, AiOutlineFileText, AiOutlineLike, AiOutlineStar } from "react-icons/ai";

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

type ProfilePageType = {
  profile: {
    user: {
      id: string;
      nickname: string;
      email: string;
      profile: string;
      created_at: string;
      platform: string;
      level: number;
    };
    recentList: PostType[];
    bookmarkList: PostType[];
    likeList: PostType[];
    myPostList: PostType[];
    myCommentList: PostType[];
  };
  isMy: boolean;
};

const ProfilePage = ({ isMy, profile: { user, recentList, bookmarkList, likeList, myPostList, myCommentList } }: ProfilePageType) => {
  const [currentNickname, setCurrentNickname] = useState(user.nickname);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(user.profile || "/default-profile.png");
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState(false);
  const [isPictureChangeModalOpen, setIsPictureChangeModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };


  const onChangeCurrentProfilePicture = (picture: string) => {
    setCurrentProfilePicture(picture);
  }
  const onChangeCurrentNickname = (nickname: string) => setCurrentNickname(nickname);

  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm("정말로 회원탈퇴하시겠습니까?\n게시글과 댓글들은 모두 영구적으로 삭제처리됩니다.");
    if (!isConfirm) return;

    const { error } = await apiRequest("DELETE", `/api/user`, { user_id: user.id });
    if (error) return alert("회원탈퇴에 실패했습니다.");

    await signOut({ callbackUrl: "/auth/signin" });
    alert("회원탈퇴가 완료되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} />
      <div css={PageStyle} className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Breadcrumb
            menuData={[
              { name: "홈", href: "/" },
              { name: isMy ? "마이페이지" : "유저", href: `/user/${user.nickname}` },
            ]}
          />
        </div>

        <h2 className="text-xl font-semibold mb-6 mt-10">{isMy ? "내" : "유저"} 정보</h2>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-6">
            <button
              disabled={!isMy}
              onClick={() => setIsPictureChangeModalOpen(true)}
              className="w-24 h-24 rounded-full overflow-hidden relative focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800"
            >
              <img src={currentProfilePicture} alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/default-profile.png")} />
              {isMy && <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-1 text-sm">변경</div>}
            </button>
            <div>
              <h1 className="text-2xl font-semibold flex">
                {currentNickname || "이름 없음"}
                {isMy && (
                  <button
                    onClick={() => setIsNameChangeModalOpen(true)}
                    className="ml-2 text-gray-500 hover:text-gray-700 flex items-center pt-1 text-sm focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 rounded-lg"
                  >
                    닉네임 변경
                  </button>
                )}
              </h1>
              <div className="mt-2 text-sm text-gray-500">
                <p>레벨: {user.level || "정보 없음"}</p>
                {/* <p>포인트: {userData.point || "정보 없음"}</p> */}
              </div>
              {isMy && (
                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="mt-4 text-gray-500 hover:text-gray-700 flex items-center pt-1 text-sm focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 rounded-lg"
                >
                  비밀번호 변경
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <Divider />
        </div>

        <h2 className="text-xl font-semibold">내 활동</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6 mb-10">
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AiOutlineEye className="text-gray-500 mr-2 text-xl" />
              최근 본 게시물
            </h3>
            {recentList.length === 0 ? <p>최근 본 게시물 게시글이 없습니다.</p> : <Table list={recentList} hiddenHeader onClickRow={(id) => (window.location.href = `/post/${id}`)} />}
          </div>
          <Divider disableIcon className="my-1" />
          {isMy && (
            <div className="mt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AiOutlineStar className="text-gray-500 mr-2 text-xl" />
                즐겨찾기
              </h3>
              {bookmarkList.length === 0 ? <p>즐겨찾기 게시글이 없습니다.</p> : <Table list={bookmarkList} hiddenHeader onClickRow={(id) => (window.location.href = `/post/${id}`)} />}
            </div>
          )}
          <Divider disableIcon className="my-1" />
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AiOutlineLike className="text-gray-500 mr-2 text-xl" />
              좋아요 누른 게시글
            </h3>
            {likeList.length === 0 ? <p>좋아요 누른 게시글이 없습니다.</p> : <Table list={likeList} hiddenHeader onClickRow={(id) => (window.location.href = `/post/${id}`)} />}
          </div>
          <Divider disableIcon className="my-1" />
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AiOutlineFileText className="text-gray-500 mr-2 text-xl" />
              {isMy ? "내" : "유저"}가 쓴 게시글
            </h3>
            {myPostList.length === 0 ? <p>{isMy ? "내" : "유저"}가 쓴 게시글이 없습니다.</p> : <Table list={myPostList} hiddenHeader onClickRow={(id) => (window.location.href = `/post/${id}`)} />}
          </div>
          <Divider disableIcon className="my-1" />
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AiOutlineComment className="text-gray-500 mr-2 text-xl" />
              {isMy ? "내" : "유저"}가 쓴 댓글
            </h3>
            {myCommentList.length === 0 ? <p>{isMy ? "내" : "유저"}가 쓴 댓글이 없습니다.</p> : <Table list={myCommentList} hiddenHeader onClickRow={(id) => (window.location.href = `/post/${id}`)} />}
          </div>
        </div>

        {isMy && (
          <div className="px-6 rounded-lg mt-2 mb-20">
            <div className="flex justify-end space-x-4">
              <button onClick={handleLogout} className="text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-400">
                로그아웃
              </button>
              <button onClick={handleDeleteAccount} className="text-white bg-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-500">
                회원탈퇴
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {/* 닉네임 변경 팝업 */}
      <ProfilePictureModal
        user={user}
        currentProfilePicture={currentProfilePicture}
        onChangeCurrentProfilePicture={onChangeCurrentProfilePicture}
        isHidden={!isPictureChangeModalOpen}
        onClose={() => setIsPictureChangeModalOpen(false)}
      />
      {/* 프로필 사진 변경 팝업 */}
      <NicknameModal
        user={user}
        currentNickName={currentNickname}
        onChangeCurrentNickname={onChangeCurrentNickname}
        isHidden={!isNameChangeModalOpen}
        onClose={() => setIsNameChangeModalOpen(false)}
      />
      {/* 비밀번호 변경 팝업 */}
      <PasswordModal user={user} isHidden={!isPasswordChangeModalOpen} onClose={() => setIsPasswordChangeModalOpen(false)} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nickname = context.params!.nickname; // 동적 경로에서 category 값을 받음

  // 세션이 없다면 로그인 페이지로 리다이렉트
  const session = await getSession({ req: context.req });
  if (!session) return { redirect: { destination: "/auth/signin", permanent: false } };

  const { data, error } = await apiRequest<any>("GET", "/api/user/profile", { nickname: nickname });
  if (error) {
    console.error("유저 조회 실패:", error);
    return { notFound: true }; // 에러 발생 시 404 페이지로 이동
  }
  const isMy = session?.user?.id === data.user.id.toString();
  return { props: { profile: {...data, user:{...data.user, id: data.user.id.toString()}}, isMy, user: { ...session?.user, id: session?.user?.id?.toString() } } };
};

export default ProfilePage;

const PageStyle = css`
  padding: 20px;
  margin-top: 30px;
`;
