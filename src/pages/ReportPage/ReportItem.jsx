import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReportItem.module.css";

// 1. 17개의 모든 지역 로고 SVG 파일을 import 합니다.
// (파일 경로는 실제 프로젝트 구조에 맞게 조정해야 할 수 있습니다.)
import region1 from "../../assets/region1.svg";
import region2 from "../../assets/region2.svg";
import region3 from "../../assets/region3.svg";
import region4 from "../../assets/region4.svg";
import region5 from "../../assets/region5.svg";
import region6 from "../../assets/region6.svg";
import region7 from "../../assets/region7.svg";
import region8 from "../../assets/region8.svg";
import region9 from "../../assets/region9.svg";
import region10 from "../../assets/region10.svg";
import region11 from "../../assets/region11.svg";
import region12 from "../../assets/region12.svg";
import region13 from "../../assets/region13.svg";
import region14 from "../../assets/region14.svg";
import region15 from "../../assets/region15.svg";
import region16 from "../../assets/region16.svg";
import region17 from "../../assets/region17.svg";

// 2. regionId를 키(key)로 사용하여 import된 로고 변수와 매핑합니다.
const REGION_LOGOS = {
  1: region1,
  2: region2,
  3: region3,
  4: region4,
  5: region5,
  6: region6,
  7: region7,
  8: region8,
  9: region9,
  10: region10,
  11: region11,
  12: region12,
  13: region13,
  14: region14,
  15: region15,
  16: region16,
  17: region17,
};

function ReportItem({ report }) {
  const navigate = useNavigate();

  const dateParts = report.publishedDate ? report.publishedDate.split("-") : [];
  const year = dateParts[0];
  const month = dateParts[1];

  const formattedDate =
    year && month ? `${year}년 ${month}월 발행` : "발행일 정보 없음";

  const handleItemClick = () => {
    navigate(`/report/${report.id}`);
  };

  // 3. report.regionId를 사용해 매핑된 로고를 찾습니다.
  // 만약 해당하는 로고가 없으면 기본 로고(defaultLogo)를 사용합니다.
  const logoUrl = REGION_LOGOS[report.regionId] || defaultLogo;

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
