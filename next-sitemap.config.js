// next-sitemap.config.js
module.exports = {
  siteUrl: "https://", // 실제 도메인 주소 입력
  generateRobotsTxt: true, // robots.txt 파일 자동 생성
  changefreq: "daily", // 페이지 변경 빈도
  priority: 0.7, // 페이지 우선순위
  sitemapSize: 5000, // 한 sitemap에 포함될 URL 개수
};
