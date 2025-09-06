import React from "react";
// 1. Link 대신 useNavigate를 import 합니다.
import { useNavigate } from "react-router-dom";
import styles from "./BackToList.module.css";
import backIconUrl from "../assets/back.svg?react";

function BackToList() {
  // 2. useNavigate 훅을 호출하여 navigate 함수를 가져옵니다.
  const navigate = useNavigate();

  // 3. 뒤로가기 동작을 처리할 함수를 만듭니다.
  const handleGoBack = () => {
    navigate(-1); // 브라우저 היסטוריה에서 한 단계 뒤로 이동합니다.
  };

  return (
    // 4. <Link>를 <button>으로 바꾸고 onClick 이벤트를 연결합니다.
    <button onClick={handleGoBack} className={styles.backLink}>
      <img src={backIconUrl} alt="뒤로가기" className={styles.icon} />
      <span>목록으로</span>
    </button>
  );
}

export default BackToList;
