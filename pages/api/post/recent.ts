import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseNumber } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return await getRecentPosts(req); // 최근본 게시글 10개 조회
  if (req.method === "POST") return await postRecent(req); // 최근본 게시글 추가
  if (req.method === "DELETE") return await deleteRecent(req); // 최근본 게시글 삭제
  return { error: "Method Not Allowed" };
};

/** @description GET /post/recent 최근 본 게시글 10개 조회 */
const getRecentPosts = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.query.user_id);

  if (user_id === null) return { error: "user_id is required, number." };
  //#endregion

  //#region Query
  const [, [result]] = await executeQuery(
    `
      SET @user_id = ?;

      SELECT p.post_id, p.title, 
             IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS user_name,
             u.level AS user_level,
             IF(DATE(p.created_at) = CURDATE(), 
                DATE_FORMAT(p.created_at, '%H:%i:%s'), 
                DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
             p.view_count, p.like_count
      FROM user_post_recent upr
      JOIN post p ON upr.post_id = p.post_id
      LEFT JOIN user u ON u.user_id = p.user_id
      WHERE upr.user_id = @user_id
      ORDER BY upr.viewed_at DESC
      LIMIT 10;
    `,
    [user_id],
  );
  return { data: result };
  //#endregion
};


/** @description POST /post/recent 최근 본 게시글 추가 */
const postRecent = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const post_id = parseNumber(req.body.post_id);
  const user_id = parseNumber(req.body.user_id);

  if (post_id === null) return { error: "post_id is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  //#endregion

  //#region Query
  const [] = await executeQuery(
    `
      SET @post_id = ?;
      SET @user_id = ?;

      -- 기존에 해당 게시글이 없다면 추가, 있으면 시간만 갱신
      INSERT INTO user_post_recent (user_id, post_id)
      VALUES (@user_id, @post_id)
      ON DUPLICATE KEY UPDATE viewed_at = NOW();
    `,
    [post_id, user_id],
  );
  return { data: { message: "Recent post added successfully" } };
  //#endregion
};

/** @description DELETE /post/recent 최근 본 게시글 삭제 */
const deleteRecent = async (req: NextApiRequest): Promise<ApiResponseType> => {
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

      -- 해당 게시글 삭제
      DELETE FROM user_post_recent WHERE post_id = @post_id AND user_id = @user_id;
    `,
    [post_id, user_id],
  );
  return { data: { message: "Recent post deleted successfully" } };
  //#endregion
};


export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
