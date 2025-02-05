import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@utils/executeQuery";
import { ApiResponseType, HandlerType, tryCatchWrapper } from "@utils/trycatchWrapper";
import { parseNumber, parseString } from "@utils/resParse";

// 요청에 따라 적절한 함수 호출
const handler: HandlerType = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return await postReport(req);
  return { error: "Method Not Allowed" };
};

/** @description POST /post/report 신고 추가 */
const postReport = async (req: NextApiRequest): Promise<ApiResponseType> => {
  //#region Parameter Check

  const post_id = parseNumber(req.body.post_id);
  const user_id = parseNumber(req.body.user_id);
  const report_reason = parseString(req.body.report_reason);

  if (post_id === null) return { error: "post_id is required, number." };
  if (user_id === null) return { error: "user_id is required, number." };
  if (report_reason === null) return { error: "report_reason is required, string." };
  //#endregion

  //#region Query
  await executeQuery(
    `
      INSERT IGNORE INTO post_report (post_id, user_id, report_reason)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE report_reason = VALUES(report_reason);
    `,
    [post_id, user_id, report_reason],
  );

  return { data: "Report added successfully" };
  //#endregion
};

export default (req: NextApiRequest, res: NextApiResponse) => tryCatchWrapper(req, res, (req, res) => handler(req, res));
