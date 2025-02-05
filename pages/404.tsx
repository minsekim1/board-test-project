import { css } from "@emotion/react";

export default function Custom404() {
  return (
    <div css={containerStyle}>
      <img src="/logo.png" alt="Logo" css={logoStyle} />
      <h1 css={titleStyle}>404</h1>
      <p css={messageStyle}>삭제되었거나 찾을 수 없는 페이지입니다.</p>
      <div css={buttonContainerStyle}>
        <button onClick={() => (window.location.href = "/")} css={buttonStyle}>
          홈으로 가기
        </button>
        <button onClick={() => window.history.back()} css={buttonStyle}>
          뒤로가기
        </button>
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
  text-align: center;
`;

const logoStyle = css`
  width: 150px;
  margin-bottom: 20px;
`;

const titleStyle = css`
  font-size: 72px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const messageStyle = css`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const buttonContainerStyle = css`
  display: flex;
  gap: 20px;
`;

const buttonStyle = css`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #0070f3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5;
  }
`;
