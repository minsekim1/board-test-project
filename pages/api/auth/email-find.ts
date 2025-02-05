import { executeQuery } from "@utils/executeQuery";
import { parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest) => {
  if (req.method === "POST") return await sendEmailVerification(req);
  return { error: "Method Not Allowed" };
};


/** @description POST /auth/email-find 이메일 인증 코드 발송 */
const sendEmailVerification = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const email = parseString(req.body.email);
  if (email === null) return { error: "email is required, string." };
  //#endregion

  //#region Check for existing email
  const [existingUser] = await executeQuery(`SELECT user_id FROM user WHERE email = ? and deleted_at is null and platform = 'email' LIMIT 1;`, [email]);
  if (!existingUser) return { error: "가입되지 않은 이메일입니다." };
  //#endregion

  //#region  20초 내에 인증 코드가 이미 발송된 경우 발송제한
  const [recentRequest] = await executeQuery(
    `
    SELECT code_id, created_at FROM auth_verification_email_code 
    WHERE email = ? AND created_at > NOW() - INTERVAL 20 SECOND AND verified_at IS NULL;
  `,
    [email],
  );
  if (recentRequest) return { error: "인증 코드 발송은 20초 간격으로만 가능합니다." };
  //#endregion

  //#region Generate & Store Verification Code
  const verificationCode = generateVerificationCode();
  const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15분 후 만료

  await executeQuery(
    `
      DELETE FROM auth_verification_email_code WHERE email = ? and verified_at IS NULL;
      INSERT INTO auth_verification_email_code (email, code, expired_at) VALUES (?, ?, ?);
    `,
    [email, email, verificationCode, expiredAt],
  );
  //#endregion

  //#region Send Email
  const emailBody = `
          <p>다음 인증 코드를 입력하여 비밀번호를 찾아주세요:</p>
          <p><strong>${verificationCode}</strong></p>
          <p>인증 코드는 15분간 유효합니다.</p>
        `;

  const transporter = createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD },
  });

  await transporter.sendMail({
    to: email,
    subject: "이메일 인증 코드",
    html: emailBody,
  });
  //#endregion

  return { data: "이메일로 인증 코드가 발송되었습니다." };
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));

const generateVerificationCode = (): string => {
  const code = Math.floor(100000 + Math.random() * 900000); // 6자리 숫자 생성
  return code.toString(); // 숫자를 문자열로 변환
};
