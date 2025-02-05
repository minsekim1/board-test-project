import { executeQuery } from "@utils/executeQuery";
import { parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return await checkEmail(req);
  if (req.method === "PATCH") return await verifyEmailVerification(req);
  if (req.method === "POST") return await sendEmailVerification(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /auth/email 이메일 중복 체크 */
const checkEmail = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const email = parseString(req.query.email);
  const platform = parseString(req.query.platform);
  if (email === null) return { error: "email is required, string." };
  if (platform === null) return { error: "platform is required, string." };
  //#endregion

  const [existingUser] = await executeQuery(`SELECT user_id FROM user WHERE email = ? and deleted_at is null and platform = ? LIMIT 1;`, [email, platform]);
  if (existingUser) return { error: "이미 가입된 이메일입니다." };
  return { data: "사용 가능한 이메일입니다." };
};

/** @description PATCH /auth/email 이메일 인증 코드 확인 */
const verifyEmailVerification = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const { email, code, type } = req.body; // 쿼리 파라미터에서 이메일과 인증 코드를 받음
  if (!email) return { error: "email is required, string." };
  if (!code) return { error: "code is required, string." };
  //#endregion

  //#region Verify Code
  const [verification] = await executeQuery<{ code_id: number }[]>(
    `
    SELECT code_id
    FROM auth_verification_email_code
    WHERE email = ? and code = ? AND expired_at > NOW() AND verified_at IS NULL
    LIMIT 1;
  `,
    [email, code],
  );

  // 인증 코드가 존재하지 않거나 만료되었으면 에러 반환
  if (!verification) return { error: "존재하지 않거나 만료된 인증 코드입니다." };
  //#endregion

  //#region Update User Verified Status
  // 인증 코드가 유효하면 사용자의 verified_at을 현재 시각으로 업데이트
  await executeQuery(
    `
      UPDATE auth_verification_email_code SET verified_at = NOW() WHERE code_id = ?;
    `,
    [verification.code_id],
  );
  //#endregion

  //#region 비밀번호 재설정
  if (type === "email-find") {
    const tempPassword = generateVerificationCode();
    const tempPasswordHash = await hash(tempPassword, 10);
    //#region 유저 임시 비밀번호 업데이트
    await executeQuery(
      `
      UPDATE user SET password_hash = ? WHERE email = ? AND deleted_at IS NULL AND platform = 'email';
    `,
      [tempPasswordHash, email],
    );
    //#endregion
    return { data: tempPassword };
  }
  //#endregion

  return { data: "이메일 인증이 완료되었습니다." };
};

/** @description POST /auth/email 이메일 인증 코드 발송 */
const sendEmailVerification = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const email = parseString(req.body.email);
  const type = parseString(req.body.type);
  if (email === null) return { error: "email is required, string." };
  //#endregion

  //#region Check for existing email
  if (type !== "email-find") {
    const [existingUser] = await executeQuery(`SELECT user_id FROM user WHERE email = ? and deleted_at is null and platform = 'email' LIMIT 1;`, [email]);
    if (existingUser) return { error: "이미 가입된 이메일입니다." };
  }
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

  await executeQuery(
    `
      DELETE FROM auth_verification_email_code WHERE email = ? and verified_at IS NULL;
      INSERT INTO auth_verification_email_code (email, code, expired_at) VALUES (?, ?, NOW() + INTERVAL 15 MINUTE);
    `,
    [email, email, verificationCode],
  );
  //#endregion

  //#region Send Email
  const emailBody = `
          <p>다음 인증 코드를 입력하여 인증을 완료해주세요:</p>
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
