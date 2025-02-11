import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2";

// MySQL DB 연결 설정

const db = mysql.createConnection({
  host: "220.70.31.85", // 또는 AWS RDS와 같은 데이터베이스 호스트 주소
  user: "admin", // DB 사용자명
  password: "Tkarnr78^@", // DB 비밀번호
  database: "board_test_project", // 데이터베이스 이름
});

// DB 연결 확인
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  db.connect((err) => {
    if (err) return res.status(500).json({ error: "DB connection failed", details: err.message });
    res.status(200).json({ message: "DB connection successful" });
  });
}
