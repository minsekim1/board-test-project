import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseInRange, parseNumber, parseString } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return await getBookmarkList(req);
  if (req.method === "POST") return await postBookmark(req);
  if (req.method === "DELETE") return await deleteBookmark(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /post/bookmark 즐겨찾기 목록 조회 */
const getBookmarkList = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseString(req.query.user_id);
  const page = parseNumber(req.query.page);
  const size = parseInRange(req.query.size, 1, 200);

  if (user_id === null) return { error: "user_id is required, string." };
  if (page === null) return { error: "page is required, number." };
  if (size === null) return { error: "size is 1-200." };
  //#endregion

  //#region Query
  const offset = (page - 1) * size;
  const [, posts, [{total}]] = await executeQuery(
    `
      SET @user_id = ?;
      SELECT p.post_id id, p.title, 
            IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
            u.level AS author_level,
            IF(DATE(p.created_at) = CURDATE(), 
                DATE_FORMAT(p.created_at, '%H:%i:%s'), 
                DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
            p.view_count, p.comment_count, p.like_count
      FROM post_bookmark pb
      JOIN post p ON pb.post_id = p.post_id
      LEFT JOIN user u ON u.user_id = p.user_id
      WHERE pb.user_id = @user_id
      ORDER BY pb.created_at DESC
      LIMIT ? OFFSET ?;

      -- 전체 게시물 수
      SELECT COUNT(*) AS total
      FROM post_bookmark pb
      JOIN post p ON pb.post_id = p.post_id
      WHERE pb.user_id = @user_id;
    `,
    [user_id, size, offset],
  );
  return { data: { list: posts, total } };
  //#endregion
};

/** @description POST /post/bookmark 북마크 추가 */
const postBookmark = async (req: NextApiRequest): Promise<ApiResponseType> => {
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

      INSERT INTO post_bookmark (post_id, user_id)
      VALUES (@post_id, @user_id)
      ON DUPLICATE KEY UPDATE created_at = NOW();

      SELECT IF(pb.user_id IS NOT NULL, 1, 0) AS is_bookmark
      FROM post p
      LEFT JOIN post_bookmark pb ON pb.user_id = @user_id AND pb.post_id = p.post_id
      WHERE p.post_id = @post_id AND p.deleted_at IS NULL;
    `,
    [post_id, user_id],
  );
  return { data: result };
  //#endregion
};

/** @description DELETE /post/bookmark 북마크 삭제 */
const deleteBookmark = async (req: NextApiRequest): Promise<ApiResponseType> => {
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

      DELETE FROM post_bookmark WHERE post_id = @post_id AND user_id = @user_id;
      
      SELECT IF(pb.user_id IS NOT NULL, 1, 0) AS is_bookmark
      FROM post p
      LEFT JOIN post_bookmark pb ON pb.user_id = @user_id AND pb.post_id = p.post_id
      WHERE p.post_id = @post_id AND p.deleted_at IS NULL;
    `,
    [post_id, user_id],
  );
  return { data: result };
  //#endregion
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
