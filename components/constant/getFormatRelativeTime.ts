import dayjs from "dayjs";

const getFormatRelativeTime = (timestamp: string) => {
   const now = dayjs();
   const createdAt = dayjs(timestamp);

   const diffInMinutes = now.diff(createdAt, "minute");
   const diffInHours = now.diff(createdAt, "hour");

   if (diffInMinutes < 1) {
     return "방금 전";
   } else if (diffInHours < 1) {
     return `${diffInMinutes}분 전`;
   } else if (createdAt.isToday()) {
     return createdAt.format(`HH:mm (${diffInHours}시간 전)`); // 오늘 작성된 경우: 시각 표시 (예: "14:30")
   } else {
     return createdAt.format("YYYY.MM.DD"); // 오늘이 아닌 경우: 날짜만 표시 (예: "2024.01.26")
   }
};

export default getFormatRelativeTime