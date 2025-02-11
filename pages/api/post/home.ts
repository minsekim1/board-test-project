// pages/api/post/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";

const getPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user_id } = req.query;

  try {
    const [
      ,
      hotList, //핫이슈
      recentList, //최근본게시물
      bookmarkList, //즐겨찾기
      noticeList, //공지사항
      freeList, //자유게시판
      buyList, //중고거래
      galleryList, //갤러리
      ssulList, //썰
      voteList, //투표
      introList, //가입인사
      newPostList, //새 게시물
      newCommentList, //새 댓글
    ] = await executeQuery(
      `
				SET @user_id = ?;
				
				-- 핫이슈
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'free'
						AND p.created_at >= CURDATE() - INTERVAL 7 DAY
						and (p.view_count + p.like_count * 100 + p.comment_count * 100) > 10
				ORDER BY 
						p.view_count + p.like_count * 100 + p.comment_count * 100 DESC
				limit 5;

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

				-- 공지사항 post 10개 가져오기
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'notice'
				ORDER BY p.created_at DESC
				limit 5;
			
				-- 자유게시판 post 10개 가져오기
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'free'
				ORDER BY p.created_at DESC
				limit 5;

				-- 중고거래
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'buy'
				ORDER BY p.created_at DESC
				limit 5;

				-- 갤러리
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'gallery'
				ORDER BY p.created_at DESC
				limit 5;

				-- 썰
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'ssul'
				ORDER BY p.created_at DESC
				limit 5;

				-- 투표
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'vote'
				ORDER BY p.created_at DESC
				limit 5;

				-- 가입인사
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
						AND p.category = 'intro'
				ORDER BY p.created_at DESC
				limit 5;

				-- 새 게시물
				SELECT  p.post_id id, p.title, 
					if(u.deleted_at is null, u.nickname, "unknown") author,
					u.level author_level,
						IF(DATE(p.created_at) = CURDATE(), 
								DATE_FORMAT(p.created_at, "%H:%i:%s"), 
								DATE_FORMAT(p.created_at, "%Y-%m-%d")) AS created_at, 
						p.view_count,
						p.like_count,
						p.comment_count
				FROM post p 
				left join user u on u.user_id = p.user_id
				WHERE p.deleted_at IS NULL 
				ORDER BY p.created_at DESC
				limit 5;

				-- 새 댓글
				SELECT
					p.post_id id,
					pc.content AS title,
					IF(u.deleted_at IS NULL, u.nickname, "unknown") AS author,
					u.level AS author_level,
					IF(DATE(pc.created_at) = CURDATE(), 
							DATE_FORMAT(pc.created_at, "%H:%i:%s"), 
							DATE_FORMAT(pc.created_at, "%Y-%m-%d")) AS created_at,
					0 view_count,
					0 like_count,
					0 comment_count
				FROM post_comment pc
				LEFT JOIN user u ON u.user_id = pc.user_id
				LEFT JOIN post p ON p.post_id = pc.post_id
				WHERE pc.deleted_at IS NULL
				ORDER BY pc.created_at DESC
				LIMIT 5;
			`,
      [user_id],
    );

    return res
      .status(200)
      .json({ data: { hotList, recentList, bookmarkList, noticeList, freeList, buyList, galleryList, ssulList, voteList, introList, newPostList, newCommentList } });
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    return res.status(500).json({ error: "Error retrieving post data" });
  }
};

export default getPost;
