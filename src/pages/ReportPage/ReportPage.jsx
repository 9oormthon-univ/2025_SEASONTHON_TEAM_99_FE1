import React, { useState, useEffect } from "react";
import styles from "./ReportPage.module.css";
import CustomDropdown from "../../components/CustomDropdown";
import refreshIconUrl from "../../assets/redirect.svg";
import ReportList from "./ReportList"; // ReportList 컴포넌트를 사용합니다.
import axiosInstance from "../../api/axiosInstance";

const REGION_OPTIONS = [
  { value: 0, label: "전체지역" },
  { value: 1, label: "서울특별시" },
  { value: 2, label: "부산광역시" },
  { value: 3, label: "대구광역시" },
  { value: 4, label: "인천광역시" },
  { value: 5, label: "광주광역시" },
  { value: 6, label: "대전광역시" },
  { value: 7, label: "울산광역시" },
  { value: 8, label: "세종특별자치시" },
  { value: 9, label: "경기도" },
  { value: 10, label: "강원도" },
  { value: 11, label: "충청북도" },
  { value: 12, label: "충청남도" },
  { value: 13, label: "전라북도" },
  { value: 14, label: "전라남도" },
  { value: 15, label: "경상북도" },
  { value: 16, label: "경상남도" },
  { value: 17, label: "제주특별자치도" },
];

const INITIAL_FILTERS = { region: 0 };

function ReportPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [groupedReports, setGroupedReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filters.region !== 0) {
          params.regionId = filters.region;
        }

        const response = await axiosInstance.get("/reports/lists", { params });

        if (response.data && response.data.isSuccess) {
          setGroupedReports(response.data.result || {}); // 데이터가 null일 경우를 대비해 기본값 설정
        } else {
          setError(
            response.data.message || "데이터를 불러오는 데 실패했습니다."
          );
        }
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filters]);

  const handleRegionChange = (regionValue) => {
    setFilters((prev) => ({ ...prev, region: parseInt(regionValue, 10) }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className={styles.policyPage}>
      <div className={styles.policyCard}>
        <div className={styles.policyDisc}>
                    <p className={styles.title}>월간 레포트</p>         {" "}
          <div className={styles.policyOptionBar}>
                       {" "}
            <p className={styles.subTitle}>
                            지역별 청년들의 다양한 목소리를 한눈에 확인하세요  
                       {" "}
            </p>
                       {" "}
            <div className={styles.selection}>
                           {" "}
              <div className={styles.dropdownContainer}>
                               {" "}
                <CustomDropdown
                  options={REGION_OPTIONS}
                  currentRegion={filters.region}
                  onRegionChange={handleRegionChange}
                />
                             {" "}
              </div>
                           {" "}
              <button
                className={styles.resetButton}
                aria-label="필터 초기화"
                onClick={handleReset}
              >
                                <img src={refreshIconUrl} alt="필터 초기화" /> 
                           {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      </div>
      <div className={styles.reportListSection}>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ReportList groupedReports={groupedReports} />
        )}
      </div>
    </div>
  );
}

export default ReportPage;
