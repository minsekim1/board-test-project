import { executeQuery } from "@utils/executeQuery";
import { parseNumber } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest) => {
  if (req.method === "PATCH") return updateProfilePicture(req); // 프로필 이미지 변경 처리
  return { error: "Method Not Allowed" };
};

/** @description PATCH /user/profile/picture 사용자 프로필 이미지 수정 */
const updateProfilePicture = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.body.user_id);
  const picture = req.body.profile_picture;

  if (user_id === null) return { error: "user_id is required, number." };
  if (picture === null) return { error: "picture is required, string." };
  //#endregion

  try {
    //#region
    const result = await executeQuery(`UPDATE user SET profile_picture = ? WHERE user_id = ? AND deleted_at IS NULL;`, [picture, user_id]);
    if (result.affectedRows === 0) return { error: "프로필 이미지 변경에 실패했습니다. 사용자를 찾을 수 없습니다." };
    //#endregion

    return { data: "프로필 이미지가 성공적으로 변경되었습니다." };
  } catch (error) {
    return { error: "이미지 처리에 실패했습니다. " };
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
