import { executeQuery } from "@utils/executeQuery";
import { parseNumber } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { compare, hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest) => {
  if (req.method === "PATCH") return updatePassword(req); // 비밀번호 변경 처리
  return { error: "Method Not Allowed" };
};

/** @description PATCH /user/profile/password 사용자 비밀번호 수정 */
const updatePassword = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.body.user_id);
  const password = req.body.password;
  const newPassword = req.body.new_password;

  if (user_id === null) return { error: "user_id is required, number." };
  if (password === null) return { error: "password is required, string." };
  if (newPassword === null) return { error: "newPassword is required, string." };
  //#endregion

  try {
    //#region
    const [user] = await executeQuery<{ password_hash: string | null; platform: string }[]>(`SELECT password_hash, platform FROM user WHERE user_id = ?;`, [user_id]);

    if (!user?.password_hash || user.platform !== "email") return { error: "이메일로 가입한 계정이 아닙니다." };

    const isMatch = await compare(password, user.password_hash);
    if (!isMatch) return { error: "현재 비밀번호가 일치하지 않습니다." };

    const hashedPassword = await hash(newPassword, 10);
    const result = await executeQuery(`UPDATE user SET password_hash = ? WHERE user_id = ?;`, [hashedPassword, user_id]);

    if (result.affectedRows === 0) return { error: "비밀번호 변경에 실패했습니다. 사용자를 찾을 수 없습니다." };
    //#endregion

    return { data: "비밀번호가 성공적으로 변경되었습니다." };
  } catch (error) {
    return { error: "비밀번호 변경에 실패했습니다. " };
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
