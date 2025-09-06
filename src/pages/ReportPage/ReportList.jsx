import React, { useContext } from "react";
import ReportItem from "./ReportItem";
import styles from "./ReportList.module.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
  return (
    <button
      className={styles.arrowButton}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      {/* 왼쪽 화살표 SVG 아이콘 */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  return (
    <button
      className={styles.arrowButton}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      {/* 오른쪽 화살표 SVG 아이콘 */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function ReportList({ groupedReports = {} }) {
  const sortedMonths = Object.keys(groupedReports).sort().reverse();

  if (sortedMonths.length === 0) {
    return <p className={styles.noReports}>해당 조건의 레포트가 없습니다.</p>;
  }

  return (
    <div>
      {sortedMonths.map((month) => {
        const [year, monthNum] = month.split("-");
        const monthTitle = `${year}년 ${parseInt(monthNum, 10)}월`;

        const reportsForMonth = groupedReports[month].map((report) => ({
          ...report,
          id: report.reportId,
          publishedDate: `${month}-01`,
        }));

        return (
          <div key={month} className={styles.monthlySection}>
            <h2 className={styles.monthTitle}>{monthTitle}</h2>
            <div className={styles.gridContainer}>
              <LeftArrow />
              <div className={styles.scrollMenuContainer}>
                <ScrollMenu>
                  {reportsForMonth.map((report) => (
                    <ReportItem
                      key={report.id}
                      itemId={String(report.id)}
                      report={report}
                    />
                  ))}
                </ScrollMenu>
              </div>
              <RightArrow />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReportList;
