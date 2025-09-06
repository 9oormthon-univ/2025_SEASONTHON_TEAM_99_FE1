import React from "react";
import styles from "./LoginModal.module.css";
import { useNavigate } from "react-router-dom";

function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  // 팝업이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  const handleLogin = () => {
    // onClose(); // 로그인 페이지로 이동하기 전에 팝업을 닫을 수 있음 (선택 사항)
    navigate("/login");
  };

  // 배경(overlay)을 클릭해도 닫히게 하되,
  // 실제 모달창 안쪽을 클릭했을 때는 닫히지 않게 stopPropagation을 사용
  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} onClick={handleModalClick}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalContent}>
          <p>로그인이 필요한 서비스입니다.</p>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            뒤로가기
          </button>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
