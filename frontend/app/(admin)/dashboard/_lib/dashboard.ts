/**
 * Dashboard 전용 데이터 타입
 * (차트/지표용 공통 데이터는 여기서 관리)
 */

export type LoginTrendPoint = {
  date: string;
  value: number;
};

/**
 * 최근 7일 로그인 수 추이
 * 지금은 더미 데이터
 * → 나중에 NestJS API로 교체 예정
 */
export async function getLoginTrendLast7Days(): Promise<LoginTrendPoint[]> {
  // 실제 API 연결 시 예시:
  // const res = await fetch("http://localhost:3001/metrics/logins?range=7d", {
  //   cache: "no-store",
  // });
  // return await res.json();

  return [
    { date: "01/17", value: 98 },
    { date: "01/18", value: 120 },
    { date: "01/19", value: 110 },
    { date: "01/20", value: 143 },
    { date: "01/21", value: 132 },
    { date: "01/22", value: 150 },
    { date: "01/23", value: 141 },
  ];
}
