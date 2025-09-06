import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import styles from "./ReportDetailPage.module.css";
// import locationIconUrl from "../../assets/location.svg?react"; // 현재 코드에서는 SVG가 하드코딩되어 있어 이 import는 사용되지 않습니다.

function ReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  // state 변수와 setter 함수의 이름을 일관성 있게 report, setReport로 변경했습니다.
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 함수 이름을 fetchReport로 더 명확하게 변경했습니다.
    const fetchReport = async () => {
      setLoading(true); // 로딩 상태 시작
      setError(null); // 이전 에러 초기화
      try {
        console.log("요청하려는 reportId:", reportId);

        const response = await axiosInstance.get(`/reports/${reportId}`);

        // API 응답이 성공적일 때만 state를 업데이트합니다.
        if (response.data && response.data.isSuccess) {
          setReport(response.data.result);
        } else {
          setError(
            response.data.message || "레포트를 불러오는 데 실패했습니다."
          );
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("레포트 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    // reportId가 있을 때만 API를 호출합니다.
    if (reportId) {
      fetchReport();
    }
    // useEffect의 의존성 배열을 올바른 변수인 reportId로 수정했습니다.
  }, [reportId]);

  if (loading) return <div className={styles.statusMessage}>로딩 중...</div>;
  if (error) return <div className={styles.statusMessage}>{error}</div>;
  if (!report)
    return (
      <div className={styles.statusMessage}>레포트를 찾을 수 없습니다.</div>
    );

  // API 응답 데이터를 조합하여 제목과 날짜를 만듭니다.
  const reportTitle = `${report.year}년 ${report.month}월 ${report.regionName} 월간 레포트`;
  // month가 한 자리 수일 경우(예: 9) 앞에 0을 붙여 "09"로 만듭니다.
  const formattedDate = `${report.year}.${String(report.month).padStart(
    2,
    "0"
  )}`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.reportDetail}>
          <div className={styles.titleSection}>
            <h1>{reportTitle}</h1>
            <div className={styles.titleMeta}>
              <div className={styles.location}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 16.6668C12.5 14.0002 15 11.6123 15 8.66683C15 5.72131 12.7614 3.3335 10 3.3335C7.23858 3.3335 5 5.72131 5 8.66683C5 11.6123 7.5 14.0002 10 16.6668Z"
                    stroke="#333"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9.99992" cy="8.33317" r="1.66667" fill="#333" />
                </svg>
                <span>{report.regionName}</span>
              </div>
              <div className={styles.date}>
                <span>{formattedDate} 발행</span>
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.content}>{report.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailPage;
