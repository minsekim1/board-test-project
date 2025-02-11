export const getCategoryData = (category: string | string[]) => {
  if (category === "buy")
    return {
      title: "중고거래",
      titleDesc: "다양한 중고 물품을 안전하고 편리하게 거래할 수 있는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "중고거래", href: "/board/buy" },
      ],
    };

  if (category === "bookmark") {
    return {
      title: "북마크",
      titleDesc: "즐겨찾기한 게시물을 빠르고 편리하게 확인할 수 있는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "북마크", href: "/board/bookmark" },
      ],
    };
  }

  if (category === "notice")
    return {
      title: "공지사항",
      titleDesc: "서비스와 관련된 중요 공지사항을 확인할 수 있는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "공지사항", href: "/board/notice" },
      ],
    };

  if (category === "free")
    return {
      title: "자유게시판",
      titleDesc: "자유롭게 의견을 나누고 다양한 주제에 대해 토론할 수 있는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "자유게시판", href: "/board/free" },
      ],
    };

  if (category === "gallery")
    return {
      title: "갤러리",
      titleDesc: "다양한 이미지나 미디어를 공유하고 감상하는 갤러리 게시판입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "갤러리", href: "/board/gallery" },
      ],
    };

  if (category === "ssul")
    return {
      title: "야설",
      titleDesc: "성인 콘텐츠와 관련된 이야기를 나누는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "야설", href: "/board/ssul" },
      ],
    };

  if (category === "vote")
    return {
      title: "투표/설문",
      titleDesc: "각종 투표와 설문을 진행하여 의견을 수렴하는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "투표/설문", href: "/board/vote" },
      ],
    };

  if (category === "intro")
    return {
      title: "가입인사",
      titleDesc: "새로운 회원들이 자신을 소개하고 인사를 나누는 공간입니다.",
      menuData: [
        { name: "홈", href: "/" },
        { name: "가입인사", href: "/board/intro" },
      ],
    };

  return { title: "", titleDesc: "", menuData: [] };
};
