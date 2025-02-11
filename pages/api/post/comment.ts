import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseNumber, parseString } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method === "GET") return await getComments(req);
  if (req.method === "POST") return await postComment(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /post/comments 댓글과 대댓글 조회 */
const getComments = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.query.user_id);
  const post_id = parseNumber(req.query.post_id);

  if (user_id === null) return { error: "user_id is required, number." };
  if (post_id === null) return { error: "post_id is required, number." };
  //#endregion

  //#region Query
  const comments = await executeQuery(
    `
      WITH RECURSIVE comment_tree AS (
              -- 기본 댓글 (최상위)
              SELECT 
                c.comment_id, 
                c.user_id, 
                c.content,
                DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i") created_at,
                DATE_FORMAT(c.updated_at, "%Y-%m-%d %H:%i") updated_at,
                u.nickname AS author,
                u.level AS author_level,
                IFNULL(u.profile_picture, "/default-profile.png") AS author_profile,
                c.parent_comment_id,
                CAST(c.comment_id AS CHAR(255)) AS comment_path  -- 루트 댓글은 자신의 ID를 경로로 설정
              FROM post_comment c
              JOIN user u ON c.user_id = u.user_id
              WHERE c.post_id = ? AND c.parent_comment_id IS NULL

              UNION ALL

              -- 대댓글 (재귀적으로 트리를 구성)
              SELECT 
                c.comment_id, 
                c.user_id, 
                c.content,
                DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i") created_at,
                DATE_FORMAT(c.updated_at, "%Y-%m-%d %H:%i") updated_at,
                u.nickname AS author,
                u.level AS author_level,
                IFNULL(u.profile_picture, "/default-profile.png") AS author_profile,
                c.parent_comment_id,
                CONCAT(ct.comment_path, ',', c.comment_id) AS comment_path  -- 부모 경로를 이어붙여 트리 계층 구조 형성
              FROM post_comment c
              INNER JOIN comment_tree ct ON ct.comment_id = c.parent_comment_id
              JOIN user u ON c.user_id = u.user_id
      )
      SELECT 
        comment_id, 
        user_id, 
        content, 
        created_at, 
        updated_at, 
        author, 
        author_level, 
        author_profile,
        parent_comment_id
      FROM comment_tree
      ORDER BY comment_path, created_at
    `,
    [post_id],
  );
  return { data: comments };
  //#endregion
};

/** @description POST /post/comment 댓글 추가 */
const postComment = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const parent_comment_id = parseNumber(req.body.parent_comment_id);
  const post_id = parseNumber(req.body.post_id);
  const user_id = parseNumber(req.body.user_id);
  const content = parseString(req.body.content);

  if (post_id === null) return { error: "post_id is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  if (content === null) return { error: "user_id is required, string." };
  //#endregion

  //#region Query
  const [, , , result] = await executeQuery(
    `
      SET @post_id = ?;
      SET @user_id = ?;

			INSERT INTO post_comment (post_id, user_id, content, parent_comment_id)
			VALUES (@post_id, @user_id, ?, ?);

      WITH RECURSIVE comment_tree AS (
              -- 기본 댓글 (최상위)
              SELECT 
                c.comment_id, 
                c.user_id, 
                c.content,
                DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i") created_at,
                DATE_FORMAT(c.updated_at, "%Y-%m-%d %H:%i") updated_at,
                u.nickname AS author,
                u.level AS author_level,
                u.profile_picture AS author_profile,
                c.parent_comment_id,
                CAST(c.comment_id AS CHAR(255)) AS comment_path  -- 루트 댓글은 자신의 ID를 경로로 설정
              FROM post_comment c
              JOIN user u ON c.user_id = u.user_id
              WHERE c.post_id = @post_id AND c.parent_comment_id IS NULL

              UNION ALL

              -- 대댓글 (재귀적으로 트리를 구성)
              SELECT 
                c.comment_id, 
                c.user_id, 
                c.content,
                DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i") created_at,
                DATE_FORMAT(c.updated_at, "%Y-%m-%d %H:%i") updated_at,
                u.nickname AS author,
                u.level AS author_level,
                u.profile_picture AS author_profile,
                c.parent_comment_id,
                CONCAT(ct.comment_path, ',', c.comment_id) AS comment_path  -- 부모 경로를 이어붙여 트리 계층 구조 형성
              FROM post_comment c
              INNER JOIN comment_tree ct ON ct.comment_id = c.parent_comment_id
              JOIN user u ON c.user_id = u.user_id
      )
      SELECT 
        comment_id, 
        user_id, 
        content, 
        created_at, 
        updated_at, 
        author, 
        author_level, 
        author_profile,
        parent_comment_id
      FROM comment_tree
      ORDER BY comment_path, created_at;  -- 대댓글은 경로순으로, 댓글은 생성 시간 순으로 정렬
		`,
    [post_id, user_id, content, parent_comment_id],
  );
  return { data: result };
  //#endregion
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
