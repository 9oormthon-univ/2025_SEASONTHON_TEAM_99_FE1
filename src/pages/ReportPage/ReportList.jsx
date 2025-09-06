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
      &lt;
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
      &gt;
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

        // --- 👇 여기가 핵심입니다! ---
        // ReportItem에 내려보내기 전에 데이터를 한 번 가공합니다.
        const reportsForMonth = groupedReports[month].map((report) => ({
          ...report,
          id: report.reportId, // 1. reportId를 id로 복사
          publishedDate: `${month}-01`, // 2. "YYYY-MM-DD" 형식의 publishedDate 생성
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
                      report={report} // 가공된 report 객체 전달
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
