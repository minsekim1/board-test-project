import { db } from "@utils/db";
import { parseInRange, parseNumber, parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") return await getPostList(req);
  if (req.method === "POST") return await createPost(req);
  if (req.method === "PATCH") return await updatePost(req);
  if (req.method === "DELETE") return await deletePost(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /post 게시물 목록 조회 */
const getPostList = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const category = parseString(req.query.category);
  const page = parseNumber(req.query.page);
  const size = parseInRange(req.query.size, 1, 200);
	
  if (category === null) return { error: "category is required, string." };
  if (page === null) return { error: "page is required, number." };
  if (size === null) return { error: "size is 1-200." };
  //#endregion

  //#region Query
  const offset = (page - 1) * size;
  const [posts, [{ total }]] = await executeQuery(
    `
			SELECT 
				p.post_id id, p.title, 
				if(u.deleted_at is null, u.nickname, "unknown") author, 
					IF(DATE(p.created_at) = CURDATE(), 
							DATE_FORMAT(p.created_at, "%H:%i"), 
							DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at,
				p.created_at = p.updated_at is_updated,
        p.view_count,
        p.comment_count,
        p.like_count
			FROM post p 
			left join user u on u.user_id = p.user_id
			WHERE p.deleted_at is null and p.category = ?
      order by p.post_id desc
			LIMIT ? OFFSET ?;

      -- 전체 게시물 수
      SELECT COUNT(*) AS total
      FROM post p
      WHERE p.deleted_at is null and p.category = ?;
    `,
    [category, size, offset, category],
  );
  return { data: { list: posts, total } };
  //#endregion
};

/** @description POST /post 게시물 생성 */
const createPost = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const user_id = parseNumber(req.body.user_id);
  const category = parseString(req.body.category);
  const title = parseString(req.body.title);
  const content = parseString(req.body.content);

  // 필수값 체크
  if (category === null) return { error: "category is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  if (title === null) return { error: "title is required, string." };
  if (content === null) return { error: "content is required, string." };
  //#endregion

  //#region Query
  const result = await executeQuery(
    `
      INSERT INTO post (user_id, category, title, content) VALUES (?, ?, ?, ?)
    `,
    [user_id, category, title, content],
  );

  return { data: { post_id: result.insertId, message: "Post created successfully" } };
  //#endregion
};

/** @description PATCH /post 게시물 수정 */
const updatePost = async (req: NextApiRequest): Promise<ApiResponseType> => {
  const post_id = req.body.post_id;
  const title = parseString(req.body.title);
  const content = parseString(req.body.content);

  if (!post_id) return { error: "post_id is required." };

  const fields: Record<string, any> = {};
  if (title !== undefined) fields.title = title;
  if (content !== undefined) fields.content = content;

  const { query, values } = buildUpdateQuery("post", fields, "post_id = ? AND deleted_at IS NULL");
  values.push(post_id);

  const result = await executeQuery(query, values);
  return result.affectedRows === 0 ? { error: "Post not found or already deleted." } : { data: { post_id, message: "Post updated successfully." } };
};

const buildUpdateQuery = (table: string, fields: Record<string, any>, where: string): { query: string; values: any[] } => {
  const keys = Object.keys(fields).filter((key) => fields[key] !== undefined); // 값이 undefined가 아닌 필드만 추출
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);
  if (!setClause) throw new Error("No valid fields provided for update.");
  const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  return { query, values };
};

/** @description DELETE /post 게시물 삭제 */
const deletePost = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const post_id = parseNumber(req.body.post_id);
  if (post_id === null) return { error: "post_id is required, number." };
  //#endregion

  const [result] = (await db.query(`UPDATE post SET deleted_at = NOW() WHERE post_id = ? AND deleted_at IS NULL`, [post_id])) as any;
  if (result.affectedRows === 0) return { error: "Post not found or already deleted" };
  return { data: { post_id, message: "Post deleted successfully" } };
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
