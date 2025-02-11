import { executeQuery } from "@utils/executeQuery";
import { parseNumber, parseString } from "@utils/resParse";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest) => {
  if (req.method === "GET") return getProfile(req);
  return { error: "Method Not Allowed" };
};

/** @description GET /user/profile 사용자 프로필 조회 */
const getProfile = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check
  const nickname = parseString(req.query.nickname);

  if (nickname === null) return { error: "nickname is required, string." };
  //#endregion


  //#region Query
  const [, , [user], recentList, bookmarkList, likeList, myPostList, myCommentList] = await executeQuery(
    `
			SET @nickname = ?;
			SET @user_id = (SELECT user_id FROM user
				WHERE CONVERT(nickname USING utf8mb4) COLLATE utf8mb4_0900_ai_ci = CONVERT(@nickname USING utf8mb4) COLLATE utf8mb4_0900_ai_ci
					AND deleted_at IS NULL);

			SELECT user_id id, nickname, email, profile_picture profile, created_at, platform, level
      FROM user 
      WHERE user_id = @user_id;


			-- 최근 본 post 10개 가져오기
			SELECT p.post_id id, p.title, 
						IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
						u.level AS author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, '%H:%i:%s'), 
								DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
						p.view_count, p.like_count
			FROM user_post_recent upr
			JOIN post p ON upr.post_id = p.post_id
			LEFT JOIN user u ON u.user_id = p.user_id
			WHERE upr.user_id = @user_id
			ORDER BY upr.viewed_at DESC
			LIMIT 5;

			-- 즐겨찾기 post 10개 가져오기
			SELECT p.post_id id, p.title, 
						IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
						u.level AS author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, '%H:%i:%s'), 
								DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
						p.view_count, p.like_count
			FROM post_bookmark pb
			JOIN post p ON pb.post_id = p.post_id
			LEFT JOIN user u ON u.user_id = p.user_id
			WHERE pb.user_id = @user_id
			ORDER BY pb.created_at DESC
			LIMIT 5;

			-- 좋아요한 post 10개 가져오기
			SELECT p.post_id AS id, p.title, 
						IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
						u.level AS author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, '%H:%i:%s'), 
								DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
						p.view_count, p.like_count
			FROM post_like pl
			JOIN post p ON pl.post_id = p.post_id
			LEFT JOIN user u ON u.user_id = p.user_id
			WHERE pl.user_id = @user_id
			ORDER BY pl.created_at DESC
			LIMIT 10;

			-- 내 게시글 10개 가져오는 쿼리
			SELECT p.post_id AS id, p.title, 
						IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
						u.level AS author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, '%H:%i:%s'), 
								DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
						p.view_count, p.like_count
			FROM post p
			LEFT JOIN user u ON u.user_id = p.user_id
			WHERE p.user_id = @user_id AND p.deleted_at IS NULL
			ORDER BY p.created_at DESC
			LIMIT 10;

			-- 코멘트를 단 게시글 10개를 가져오는 쿼리
			SELECT DISTINCT p.post_id AS id, pc.content title, 
						IF(u.deleted_at IS NULL, u.nickname, 'unknown') AS author,
						u.level AS author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, '%H:%i:%s'), 
								DATE_FORMAT(p.created_at, '%Y-%m-%d')) AS created_at, 
						0 view_count, 0 like_count,
						pc.created_at AS comment_created_at
			FROM post_comment pc
			JOIN post p ON pc.post_id = p.post_id
			LEFT JOIN user u ON u.user_id = p.user_id
			WHERE pc.user_id = @user_id AND pc.deleted_at IS NULL
			ORDER BY pc.created_at DESC
			LIMIT 10;

		`,
    [nickname],
  );
  return { data: { user, recentList, bookmarkList, likeList, myPostList, myCommentList } };
  //#endregion

};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
