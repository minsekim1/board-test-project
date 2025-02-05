// pages/api/post/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseNumber } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return await getPost(req);
  if (req.method === "POST") return { error: "Method Not Allowed" };
  if (req.method === "PATCH") return { error: "Method Not Allowed" };
  if (req.method === "DELETE") return { error: "Method Not Allowed" };
  return { error: "Method Not Allowed" };
};

/** @description GET /post 게시물 목록 조회 */
const getPost = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const post_id = parseNumber(req.query.post_id);
  const user_id = parseNumber(req.query.user_id);

  if (post_id === null) return { error: "id is required, number." };
  //#endregion

  //#region Query
  const [, , , [post]] = await executeQuery(
    `
      SET @user_id = ?;
      SET @post_id = ?;
      
      -- 조회수 + 1
      UPDATE post
        SET view_count = view_count + 1
        WHERE post_id = @post_id AND deleted_at IS NULL;

      SELECT p.post_id, p.title, p.content, p.category,
        IF(u.deleted_at IS NULL, u.nickname, "unknown") AS author, 
        IFNULL(u.profile_picture, "/default-profile.png") AS author_profile, 
        u.level AS author_level, 
        DATE_FORMAT(p.created_at, "%Y-%m-%d %H:%i") AS created_at,
        p.view_count, p.like_count,

        IF(pb.user_id IS NOT NULL, 1, 0) AS is_bookmark,
        IF(pl.user_id IS NOT NULL, 1, 0) AS is_like,
        IF(pd.user_id IS NOT NULL, 1, 0) AS is_dislike
      FROM post p
      LEFT JOIN user u ON u.user_id = p.user_id
      LEFT JOIN post_bookmark pb ON pb.user_id = @user_id AND pb.post_id = p.post_id
      LEFT JOIN post_like pl ON pl.user_id = @user_id AND pl.post_id = p.post_id
      LEFT JOIN post_dislike pd ON pd.user_id = @user_id AND pd.post_id = p.post_id
      WHERE p.post_id = @post_id AND p.deleted_at IS NULL;

      -- 최근본 post 추가
      ${
        user_id
          ? `INSERT INTO user_post_recent (user_id, post_id)
        VALUES (@user_id, @post_id)
        ON DUPLICATE KEY UPDATE viewed_at = NOW();`
          : ""
      }
    `,
    [user_id, post_id],
  );
  return { data: post };
  //#endregion
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
