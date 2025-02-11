import { executeQuery } from "@utils/executeQuery";
import { parseNumber, parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest) => {
  if (req.method === "GET") return checkNicknameDuplicate(req); // 닉네임중복체크
  if (req.method === "PATCH") return updateNickname(req); // PATCH 요청 처리 추가
  return { error: "Method Not Allowed" };
};

/** @description GET /user/profile/nickname/check 닉네임 중복 체크 */
const checkNicknameDuplicate = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const nickname = parseString(req.query.nickname);
  if (nickname === null) return { error: "nickname is required, string." };
  //#endregion

  //#region Check for duplicate nickname
  const [existingUser] = await executeQuery(`SELECT user_id FROM user WHERE nickname = ?`, [nickname]);
  if (existingUser) return { error: "이미 사용중인 닉네임입니다." };
  //#endregion

  return { data: "사용 가능한 닉네임입니다." };
};

/** @description PATCH /user/profile/nickname 사용자 프로필 수정 (닉네임 변경) */
const updateNickname = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.body.user_id);
  const nickname = parseString(req.body.nickname);

  if (user_id === null) return { error: "user_id is required, number." };
  if (nickname === null) return { error: "nickname is required, string." };
  //#endregion

  //#region Check for duplicate nickname
  const [existingUser] = await executeQuery(`SELECT user_id FROM user WHERE nickname = ?`, [nickname]);
  if (existingUser) return { error: "이미 사용중인 닉네임입니다." };
  //#endregion

  //#region Query
  const result = await executeQuery(
    `
      UPDATE user SET nickname = ? WHERE user_id = ? AND deleted_at IS NULL;
    `,
    [nickname, user_id],
  );

  if (result.affectedRows === 0) return { error: "프로필 변경에 실패했습니다. 사용자를 찾을 수 없습니다." };
  //#endregion

  return { data: "프로필 성공적으로 변경되었습니다." };
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
