import React, { useState, useEffect, useCallback } from "react";
import styles from "./PolicyPage.module.css";
import SearchBar from "../../components/SearchBar";
import FilterSection from "../PolicyPage/FilterSection";
import PolicyList from "../PolicyPage/PolicyList";
import axiosInstance from "../../api/axiosInstance";
import qs from "qs";

const INITIAL_FILTERS = {
  plcyNm: "",
  categories: [],
  regions: [],
  sort: "최신순",
};

function PolicyPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [policies, setPolicies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드에서 한 번에 가져올 개수 (최대치로 설정)
  const backendPageSize = 150;
  // 프론트에서 보여줄 개수
  const frontendPageSize = 10;

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (filters.sort === "좋아요순") {
          response = await axiosInstance.get("/youth/policies/likes", {
            params: {
              pageNum: 1,
              pageSize: backendPageSize,
            },
          });
        } else {
          const params = {
            plcyNm: filters.plcyNm,
            categories: filters.categories,
            regions: filters.regions,
            pageNum: 1, // 항상 첫 페이지만 호출
            pageSize: backendPageSize,
          };

          response = await axiosInstance.get("/youth/policies/search", {
            params,
            paramsSerializer: (params) => {
              return qs.stringify(params, { arrayFormat: "repeat" });
            },
          });
        }

        if (response.data && response.data.isSuccess && response.data.result) {
          setPolicies(response.data.result.policies);
          setCurrentPage(1); // 필터 바뀌면 첫 페이지로
        } else {
          throw new Error(
            response.data.message || "데이터를 불러오는 데 실패했습니다."
          );
        }
      } catch (e) {
        setError(new Error("데이터를 불러오는 중 오류가 발생했습니다."));
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [filters]);

  // 현재 페이지에 보여줄 데이터
  const startIndex = (currentPage - 1) * frontendPageSize;
  const currentPolicies = policies.slice(
    startIndex,
    startIndex + frontendPageSize
  );

  // 총 페이지 수
  const totalPages = Math.ceil(policies.length / frontendPageSize);

  // 페이징 블록 (한 번에 10페이지씩)
  const blockSize = 10;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const blockStart = currentBlock * blockSize + 1;
  const blockEnd = Math.min(blockStart + blockSize - 1, totalPages);

  // 🔹 핸들러들
  const handleSearchChange = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, plcyNm: searchTerm }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  }, []);

  const handleRegionChange = useCallback((regionName) => {
    setFilters((prev) => ({
      ...prev,
      regions: regionName === "전체지역" ? [] : [regionName],
    }));
  }, []);

  const handleSortChange = useCallback((sort) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return (
    <div className={styles.policyPage}>
      <div className={styles.policyCard}>
        <div className={styles.policyDisc}>
          <p className={styles.title}>정책 모아보기</p>
          <p className={styles.subTitle}>
            청년을 위한 다양한 정책을 한눈에 확인하세요
          </p>
        </div>

        <div className={styles.policySearch}>
          <SearchBar onSearch={handleSearchChange} />
        </div>

        <FilterSection
          activeTags={filters.categories}
          currentRegion={filters.regions[0] || "전체"}
          onTagClick={handleCategoryChange}
          onRegionChange={handleRegionChange}
          onReset={handleReset}
        />
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <>
          <PolicyList
            policies={currentPolicies}
            activeSort={filters.sort}
            onSortChange={handleSortChange}
          />

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {Array.from(
              { length: blockEnd - blockStart + 1 },
              (_, i) => blockStart + i
            ).map((page) => (
              <button
                key={page}
                className={page === currentPage ? styles.activePage : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PolicyPage;
