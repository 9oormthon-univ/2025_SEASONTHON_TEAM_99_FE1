import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReportItem.module.css";

const REGION_LOGOS = {
  서울특별시: "/logos/seoul.png",
  경기도: "/logos/gyeonggi.png",
  강원특별자치도: "/logos/gangwon.png",
  경상남도: "/logos/gyeongnam.png",
  // ... 나머지 지역 로고 추가
};

function ReportItem({ report }) {
  const navigate = useNavigate();

  // --- 👇 에러 방지 코드 추가 ---
  // 혹시라도 report.publishedDate가 없는 경우를 대비하여 기본값을 설정합니다.
  const dateParts = report.publishedDate ? report.publishedDate.split("-") : [];
  const year = dateParts[0];
  const month = dateParts[1];

  // year와 month가 모두 있을 때만 날짜를 만들고, 아니면 대체 텍스트를 보여줍니다.
  const formattedDate =
    year && month ? `${year}년 ${month}월 발행` : "발행일 정보 없음";

  const handleItemClick = () => {
    navigate(`/report/${report.id}`);
  };

  const logoUrl = REGION_LOGOS[report.regionName] || "/logos/default.png";

  return (
    <div key={report.id} className={styles.reportItemContainer}>
      <div className={styles.reportItem} onClick={handleItemClick}>
        <div className={styles.logoContainer}>
          <img src={logoUrl} alt={`${report.regionName} 로고`} />
        </div>
      </div>
      <h3 className={styles.regionName}>{report.regionName}</h3>
      <span className={styles.publishDate}>{formattedDate}</span>
    </div>
  );
}

export default ReportItem;
