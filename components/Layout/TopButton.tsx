import { useEffect, useState } from "react";

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 페이지 스크롤 위치에 따라 Top 버튼의 표시 여부를 설정
  const handleScroll = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 페이지 상단으로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 15px",
            backgroundColor: "#1d1d1d",
            color: "#fff",
            border: "none",
            borderRadius: "100px",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          Go to Top
        </button>
      )}
    </>
  );
};

export default TopButton;
