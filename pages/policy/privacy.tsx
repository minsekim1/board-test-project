import { css } from "@emotion/react";

export default function Privacy() {
  return (
    <div css={containerStyle}>
      <pre css={textStyle}>{text}</pre>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const textStyle = css`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap; /* 텍스트 줄바꿈 적용 */
  word-wrap: break-word; /* 긴 단어가 화면을 벗어나지 않도록 처리 */
  max-width: 800px; /* 적당한 너비로 설정 */
  margin: 0;
  padding: 0;
`;

const text = `

# Board Test Project(domain.com) 개인정보처리방침


## 1. 개인정보의 처리 목적
본 서비스는 이용자의 개인정보를 다음과 같은 목적으로 처리합니다.
- 서비스 제공 및 운영
- 회원 관리 및 고객 지원
- 서비스 개선을 위한 데이터 분석

## 2. 개인정보의 처리 항목
본 서비스에서는 다음과 같은 개인정보를 수집하고 처리합니다.
- 이메일 주소
- 사용자 이름(닉네임)
- 프로필 사진
- 로그인 기록

## 3. 개인정보의 보유 및 이용 기간
이용자의 개인정보는 서비스 제공을 위해 필요한 기간 동안 보유합니다. 회원 탈퇴 시 또는 목적 달성 후 개인정보는 즉시 파기됩니다.

## 4. 개인정보의 파기
- 개인정보는 보유 기간 종료 시 자동으로 파기됩니다.
- 전자적 파일 형태로 보관되는 개인정보는 복구할 수 없도록 삭제합니다.

## 5. 개인정보의 제3자 제공
본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의한 요청이 있을 경우 제공될 수 있습니다.

## 6. 개인정보 보호를 위한 기술적/관리적 대책
- 개인정보는 암호화되어 안전하게 저장됩니다.
- 데이터 접근은 권한이 있는 사용자에게만 제한적으로 허용됩니다.

## 7. 이용자의 권리
- 이용자는 언제든지 자신의 개인정보에 접근하거나 수정, 삭제를 요청할 수 있습니다.
- 개인정보 관련 문의는 고객센터 또는 이메일을 통해 처리됩니다.

## 8. 개인정보 보호 책임자
- 책임자: 
- 연락처: 

## 9. 변경사항
이 개인정보처리방침은 법적 요구사항 또는 서비스의 변경에 따라 수시로 변경될 수 있습니다. 변경 사항은 서비스 웹사이트에 공지됩니다.
`;
