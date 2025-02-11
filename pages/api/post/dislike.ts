import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseNumber } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return await postDislike(req);
  if (req.method === "DELETE") return await deleteDislike(req);
  return { error: "Method Not Allowed" };
};

/** @description POST /post/dislike 싫어요 추가 */
const postDislike = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const post_id = parseNumber(req.body.post_id);
  const user_id = parseNumber(req.body.user_id);

  if (post_id === null) return { error: "post_id is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  //#endregion

  //#region Query
  const [, , , [result]] = await executeQuery(
    `
      SET @post_id = ?;
      SET @user_id = ?;

      INSERT INTO post_dislike (post_id, user_id)
      VALUES (@post_id, @user_id)
      ON DUPLICATE KEY UPDATE created_at = NOW();

      SELECT p.dislike_count,
        IF(pd.user_id IS NOT NULL, 1, 0) AS is_dislike
      FROM post p
      LEFT JOIN post_dislike pd ON pd.user_id = @user_id AND pd.post_id = p.post_id
      WHERE p.post_id = @post_id AND p.deleted_at IS NULL;
    `,
    [post_id, user_id],
  );

  return { data: result };
  //#endregion
};

/** @description DELETE /post/dislike 싫어요 삭제 */
const deleteDislike = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const post_id = parseNumber(req.body.post_id);
  const user_id = parseNumber(req.body.user_id);

  if (post_id === null) return { error: "post_id is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  //#endregion

  //#region Query
  const [, , , [result]] = await executeQuery(
    `
      SET @post_id = ?;
      SET @user_id = ?;

      DELETE FROM post_dislike WHERE post_id = @post_id AND user_id = @user_id;
      
      SELECT IF(pd.user_id IS NOT NULL, 1, 0) AS is_dislike
      FROM post p
      LEFT JOIN post_dislike pd ON pd.user_id = @user_id AND pd.post_id = p.post_id
      WHERE p.post_id = @post_id AND p.deleted_at IS NULL;
    `,
    [post_id, user_id],
  );
  return { data: result };
  //#endregion
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
