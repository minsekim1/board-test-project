import axios from "axios";

const NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * API 응답 구조
 * @template T - 응답 데이터의 타입
 */
interface ApiResponse<T> {
  data: T | null; // 응답 데이터
  status: number; // HTTP 상태 코드
  error: string | null; // 오류 메시지
}

/**
 * API 요청을 처리하는 함수
 * @template T - 응답 데이터의 타입
 * @param method - HTTP 메서드 (GET, POST, PUT, DELETE, PATCH 중 하나)
 * @param url - 요청을 보낼 API URL
 * @param params - 요청 파라미터 (GET 요청 시 params, 나머지 요청은 data)
 * @returns API 응답 객체 (data, status, error 포함)
 * @example
 * ```
 * const { data, error } = await apiRequest<any>('GET', '/api/post/id', {params: { id: 2 }})
 * if (error) return alert('요청에 실패했습니다.' + error);
 * ```
 */
const apiRequest = async <T>(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", url: string, data?: Record<string, any> | null): Promise<ApiResponse<T>> => {
  
  const config = {
    method, // HTTP 메서드 설정
    url: !url.includes("http") ? NEXTAUTH_URL + url : url, // 요청할 URL
    ...(method === "GET" ? { params: data } : { data: data }), // GET 요청 시 params, 나머지 요청은 data 사용
  };

  return axios(config)
    .then((response) => ({ data: response.data.data, status: response.status, error: null }))
    .catch((error: any) => {
      const errorMsg = error.response && error.response.data && error.response.data.error ? error.response.data.error : "Unknown Error"; // 오류 메시지 추출
      console.error('API Request Error',{ status: error.response?.status, errorMsg: errorMsg, error:error });
      return { data: null, status: error.response?.status || 500, error: errorMsg };
    });
};

export default apiRequest;
