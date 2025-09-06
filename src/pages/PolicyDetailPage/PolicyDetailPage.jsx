import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./PolicyDetailPage.module.css";
import axiosInstance from "../../api/axiosInstance";

import locationIconUrl from "../../assets/location.svg";
import heartIconUrl from "../../assets/fullheart.svg";
import s_cIconUrl from "../../assets/support_content.svg";
import s_sIconUrl from "../../assets/support_size.svg";
import calIconUrl from "../../assets/cal.svg";
import BacktoList from "../../components/BacktoList";
import CommentsSection from "../../components/CommentSection";
const DisplayData = ({ data, fallbackText = "등록된 정보 없음" }) => {
  // data가 존재하고(null, undefined가 아님) 공백을 제외한 문자열이 있을 때만 내용을 보여줌
  if (data && String(data).trim() !== "") {
    // pre-wrap 스타일을 적용하여 API 데이터의 줄바꿈 등을 유지
    return <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{data}</p>;
  }
  // 그렇지 않으면 fallback 텍스트를 보여줌
  return <p style={{ color: "#868e96", margin: 0 }}>{fallbackText}</p>;
};

// 재사용 가능한 상세 정보 카드 컴포넌트
const DetailIcon = ({ children }) => (
  <div className={styles.detailIcon}>{children}</div>
);

const DetailCard = ({ icon, title, children }) => (
  <div className={styles.detailCard}>
    <div className={styles.detailCardHeader}>
      {icon && <DetailIcon>{icon}</DetailIcon>}
      <h4>{title}</h4>
    </div>
    <div className={styles.detailCardContent}>{children}</div>
  </div>
);

// 심사 방법 파싱
const ScreeningSteps = ({ screeningData }) => {
  // 1. 파싱 로직은 그대로 유지합니다.
  const steps = useMemo(() => {
    if (!screeningData || typeof screeningData !== "string") return [];
    return screeningData
      .split("\n")
      .map((line) => {
        const match = line.match(/^(\d+)\.\s*(.*?)\s*:\s*(.*)$/);
        if (match) {
          const [, number, title, content] = match;
          return { number, title, content: content.trim() }; // content 양 끝 공백 제거
        }
        return null;
      })
      .filter(Boolean);
  }, [screeningData]);

  // 데이터가 아예 없는 경우 "등록된 정보 없음"을 표시합니다.
  if (!screeningData || screeningData.trim() === "") {
    return <DisplayData data={screeningData} />;
  }

  // 2. 렌더링 로직을 명확하게 수정합니다.
  if (steps.length > 0) {
    // Case 1: 파싱 성공 시 (항목이 1개 이상일 때) -> 여러 카드를 Grid로 표시
    return (
      <div className={styles.gridContainer}>
        {steps.map((step) => (
          <DetailCard key={step.number} icon={step.number}>
            <p className={styles.gridTitle}>{step.title}</p>
            <DisplayData data={step.content} />
          </DetailCard>
        ))}
      </div>
    );
  } else {
    // Case 2: 파싱 실패 시 (일반 텍스트일 때) -> 하나의 DetailCard에 전체 텍스트를 표시
    return (
      <DetailCard>
        <DisplayData data={screeningData} />
      </DetailCard>
    );
  }
};
function PolicyDetailPage() {
  const { policyName } = useParams();
  const location = useLocation();
  const { likes = "...", status = "확인중" } = location.state || {};

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicyDetail = async () => {
      setLoading(true);
      setError(null);
      const decodedPolicyName = decodeURIComponent(policyName);

      try {
        const response = await axiosInstance.get("/youth/policies/detail", {
          params: { plcyNm: decodedPolicyName },
        });

        if (response.data && response.data.isSuccess) {
          setPolicy(response.data.result);
        } else {
          throw new Error(
            response.data.message || "정책 정보를 불러오지 못했습니다."
          );
        }
      } catch (e) {
        setError(e);
        console.error("API 호출 중 오류 발생:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyDetail();
  }, [policyName]);

  const getStatusClassName = (currentStatus) => {
    if (currentStatus === "완료") return styles.completed;
    if (currentStatus === "진행중") return styles.inProgress;
    if (currentStatus === "진행전") return styles.beforeStart;
    return "";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>정책 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>오류가 발생했습니다: {error.message}</p>
        <BacktoList />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className={styles.container}>
        <p>해당 정책 정보를 찾을 수 없습니다.</p>
        <BacktoList />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <BacktoList />
      </header>
      <main className={styles.mainContent}>
        <section className={styles.titleCard}>
          <div className={styles.titleHeader}>
            <span
              className={`${styles.statusBadge} ${getStatusClassName(status)}`}
            >
              {status}
            </span>
            <h1>{policy.plcyNm}</h1>
            <div className={styles.titleMeta}>
              <div className={styles.location}>
                <img src={locationIconUrl} alt="지역" className={styles.icon} />
                <span>{policy.regions?.join(", ") || "전국"}</span>
              </div>
              <div className={styles.likes}>
                <img src={heartIconUrl} alt="좋아요" className={styles.icon} />
                <span>{likes}</span>
              </div>
            </div>
          </div>
          <a
            href={policy.aplyUrlAddr}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.applyButton}
          >
            신청하기
          </a>
        </section>
        <hr />
        <section className={styles.section}>
          <h2>정책 설명</h2>
          <DisplayData data={policy.plcyExplnCn} />
        </section>
        <section className={styles.section}>
          <h2>지원 내용</h2>
          <div className={styles.gridContainer}>
            <DetailCard icon={<img src={s_cIconUrl} alt="지원내용" />}>
              <p className={styles.gridTitle}>지원 내용</p>
              <DisplayData data={policy.plcySprtCn} />
            </DetailCard>
            <DetailCard icon={<img src={s_sIconUrl} alt="지원규모" />}>
              <p className={styles.gridTitle}>지원 규모</p>
              <p>{policy.sprtSclLmtYn === "Y" ? "제한 있음" : "제한 없음"}</p>
            </DetailCard>
          </div>
        </section>
        <section className={styles.section}>
          <h2>신청 정보</h2>
          <div className={styles.gridContainer}>
            <DetailCard icon={<img src={calIconUrl} alt="기간" />}>
              <p className={styles.gridTitle}>신청 기간</p>
              <DisplayData data={policy.aplyYmd} />
              <p className={styles.gridTitle} style={{ marginTop: "16px" }}>
                사업 기간
              </p>
              <DisplayData
                data={
                  policy.bizPrdBgngYmd &&
                  `${policy.bizPrdBgngYmd}~${policy.bizPrdEndYmd}`
                }
              />
            </DetailCard>
          </div>
        </section>
        <section className={styles.section}>
          <h2>자격 요건</h2>
          <div className={styles.grid3Container}>
            <DetailCard>
              <p className={styles.gridNTitle}>연령</p>
              <p style={{ whiteSpace: "pre-wrap" }}>
                <b>나이:</b> 만 {policy.sprtTrgtMinAge}세 ~ 만{" "}
                {policy.sprtTrgtMaxAge}세<br />
              </p>
            </DetailCard>
            <DetailCard>
              <p className={styles.gridNTitle}>지역</p>
              <DisplayData data={policy.zipCd} />
            </DetailCard>
            <DetailCard>
              <p className={styles.gridNTitle}>학력</p>
              <DisplayData data={policy.schoolCd} />
            </DetailCard>
            <DetailCard>
              <p className={styles.gridNTitle}>취업 상태</p>
              <DisplayData data={policy.jobCd} />
            </DetailCard>
            <DetailCard>
              <p className={styles.gridNTitle}>소득 조건</p>
              <DisplayData data={policy.earnCndSeCd} />
            </DetailCard>
            <DetailCard>
              <p className={styles.gridNTitle}>기타 조건</p>
              <DisplayData data={policy.addAplyQlfcCndCn} />
            </DetailCard>
          </div>
        </section>
        <section className={styles.section}>
          <h2>제출 서류</h2>
          <div className={styles.gridContainer}>
            <DetailCard>
              <p className={styles.gridNTitle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.37001 2.61662C5.57397 2.59996 5.81602 2.59998 6.07034 2.60001H15.0644L20.4001 8.20251L20.4001 19.9298C20.4001 20.1841 20.4001 20.4261 20.3835 20.6301C20.3653 20.8525 20.3229 21.1076 20.193 21.3626C20.0108 21.7201 19.7202 22.0108 19.3627 22.1929C19.1077 22.3228 18.8526 22.3652 18.6302 22.3834C18.4262 22.4001 18.1842 22.4 17.9299 22.4H6.07028C5.81598 22.4 5.57396 22.4001 5.37001 22.3834C5.1476 22.3652 4.89249 22.3228 4.63752 22.1929C4.28001 22.0108 3.98935 21.7201 3.80719 21.3626C3.67727 21.1076 3.63488 20.8525 3.61671 20.6301C3.60005 20.4261 3.60007 20.1841 3.6001 19.9298V5.07025C3.60007 4.81593 3.60005 4.57388 3.61671 4.36992C3.63488 4.14751 3.67727 3.8924 3.80719 3.63743C3.98935 3.27992 4.28001 2.98926 4.63752 2.8071C4.89249 2.67718 5.1476 2.63479 5.37001 2.61662ZM5.40009 4.49981C5.40009 4.44458 5.44486 4.39981 5.50009 4.39981H13.1001V9.4002H18.6001V20.4998C18.6001 20.555 18.5553 20.5998 18.5001 20.5998H5.50009C5.44486 20.5998 5.40009 20.555 5.40009 20.4998V4.49981ZM14.9001 7.6002V5.03731L17.3409 7.6002H14.9001Z"
                    fill="#171719"
                  />
                  <path
                    d="M12.5001 15.8004H7.50012V14.0004H12.5001V15.8004Z"
                    fill="#171719"
                  />
                  <path
                    d="M7.50012 18.8004H12.5001V17.0004H7.50012V18.8004Z"
                    fill="#171719"
                  />
                </svg>
                기본 서류
              </p>
              <DisplayData data={policy.sbmsnDcmntCn} />
            </DetailCard>
          </div>
        </section>
        <section className={styles.section}>
          <h2>심사 방법</h2>
          <div className={styles.screeningDataCon}>
            <ScreeningSteps screeningData={policy.srngMthdCn} />
          </div>
        </section>

        <DetailCard>
          <p className={styles.gridNTitle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.9997 2.95001C7.6208 2.95001 2.44971 8.12112 2.44971 14.5C2.44971 20.8789 7.6208 26.05 13.9997 26.05C20.3785 26.05 25.5496 20.8789 25.5496 14.5C25.5496 8.12112 20.3785 2.95001 13.9997 2.95001ZM13.9997 5.05001C8.78059 5.05001 4.5497 9.28092 4.5497 14.5C4.5497 19.7191 8.78059 23.95 13.9997 23.95C19.2187 23.95 23.4496 19.7191 23.4496 14.5C23.4496 9.28092 19.2187 5.05001 13.9997 5.05001ZM12.833 9.83335C12.833 9.18901 13.3553 8.66668 13.9997 8.66668C14.644 8.66668 15.1663 9.18901 15.1663 9.83335C15.1663 10.4777 14.644 11 13.9997 11C13.3553 11 12.833 10.4777 12.833 9.83335ZM12.9497 12.75V20.3333H15.0497V12.75H12.9497Z"
                fill="#767676"
              />
            </svg>
            추가 정보
          </p>
          <p className={styles.moreinfo}>
            최초등록일 {policy.frstRegDt} 최종수정일 {policy.lastMdfcnDt}
          </p>
        </DetailCard>
      </main>
      <CommentsSection
        type="policy"
        id={policy.plcyNo}
        metadata={{ plcyNm: policy.plcyNm }}
      />
    </div>
  );
}

export default PolicyDetailPage;
