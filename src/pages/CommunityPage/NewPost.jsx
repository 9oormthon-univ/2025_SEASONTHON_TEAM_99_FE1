import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import CustomDropdown from "../../components/CustomDropdown";
import styles from "./NewPost.module.css";

import CalIcon from "../../assets/cal.svg"; // 📅 달력 아이콘

const MAX_IMAGES = 3;

const REGION_OPTIONS_FOR_NEW_POST = [
  { value: "", label: "전체지역" },
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

function NewPostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [regionId, setRegionId] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [imageFile, setImageFile] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  // ✅ 투표 관련 상태
  const [showVote, setShowVote] = useState(false);
  const [voteQuestion, setVoteQuestion] = useState("");
  const [voteOptions, setVoteOptions] = useState(["", ""]);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleRegionChange = (regionValue) => {
    setRegionId(parseInt(regionValue, 10));
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFile.length + files.length > MAX_IMAGES) {
      alert(`사진은 최대 ${MAX_IMAGES}장까지 추가할 수 있습니다.`);
      return;
    }

    const newImageFile = [...imageFile, ...files];
    const newImagePreviews = newImageFile.map((file) =>
      URL.createObjectURL(file)
    );

    setImageFile(newImageFile);
    setImagePreviews(newImagePreviews);
  };

  const removeImage = (indexToRemove) => {
    setImageFile((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCancel = () => {
    if (
      window.confirm("작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")
    ) {
      navigate(-1);
    }
  };

  // ✅ 투표 관련 핸들러
  const handleAddOption = () => {
    if (voteOptions.length >= 5) {
      alert("항목은 최대 5개까지 추가할 수 있습니다.");
      return;
    }
    setVoteOptions([...voteOptions, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...voteOptions];
    updated[index] = value;
    setVoteOptions(updated);
  };

  // ✅ 항목 삭제 핸들러
  const handleRemoveOption = (indexToRemove) => {
    setVoteOptions((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !regionId || !content) {
      alert("필수항목: 제목과 지역, 본문을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("regionId", regionId);
    formData.append("isAnonymous", isAnonymous);

    if (imageFile.length > 0) {
      imageFile.forEach((file) => {
        formData.append("imageFile", file);
      });
    }

    // ✅ 투표 정보 추가
    if (showVote && voteQuestion && voteOptions.some((opt) => opt.trim() !== "")) {
      formData.append("question", voteQuestion);
      voteOptions.forEach((opt) => formData.append("options", opt));
      if (endDate) formData.append("endDate", endDate + " 23:59:59");
      formData.append("multipleChoice", multipleChoice);
    }

    try {
      await axiosInstance.post("/posts/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/community");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      const message =
        error.response?.data?.message || "게시글 발행에 실패했습니다.";
      alert(message);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* ✅ 익명여부 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>익명여부</label>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">익명</label>
          </div>
        </div>

        {/* 제목 */}
        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>
            제목
          </label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            style={{ height: "82px" }}
          />
        </div>

        {/* 지역 */}
        <div className={styles.inputGroup}>
          <label htmlFor="region" className={styles.label}>
            지역
          </label>
          <div className={styles.dropdownContainer}>
            <CustomDropdown
              options={REGION_OPTIONS_FOR_NEW_POST}
              currentRegion={regionId}
              onRegionChange={handleRegionChange}
            />
          </div>
        </div>

        {/* 본문 */}
        <div className={styles.inputGroup}>
          <label htmlFor="content" className={styles.label}>
            내용
          </label>
          <textarea
            id="content"
            placeholder="청년 정책과 관련된 경험이나 정보를 공유해보세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
        </div>

        {/* 사진 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>사진</label>
          <div className={styles.imageSection}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className={styles.imagePreviewContainer}>
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            ))}

            {imageFile.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={handleImageUploadClick}
                className={styles.imageUploadButton}
              >
                <span>
                  사진 추가하기<br />({imageFile.length}/{MAX_IMAGES})
                </span>
              </button>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* ✅ 투표 */}
        <div className={styles.voteSection}>
          <h3>투표</h3>

          {!showVote ? (
            <button
              type="button"
              className={styles.voteAddButton}
              onClick={() => setShowVote(true)}
            >
              추가하기 +
            </button>
          ) : (
            <>
              <button
                type="button"
                className={styles.voteCancelButton}
                onClick={() => setShowVote(false)}
              >
                취소하기
              </button>

              <input
                type="text"
                placeholder="투표 제목을 입력하세요"
                className={styles.voteInput}
                value={voteQuestion}
                onChange={(e) => setVoteQuestion(e.target.value)}
              />

              {voteOptions.map((opt, idx) => (
                <div key={idx} className={styles.voteOptionWrapper}>
                  <input
                    type="text"
                    placeholder="항목을 입력하세요"
                    className={styles.voteInput}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                  {voteOptions.length > 2 && (
                    <button
                      type="button"
                      className={styles.removeOptionButton}
                      onClick={() => handleRemoveOption(idx)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className={styles.voteOptionAdd}
                onClick={handleAddOption}
              >
                항목추가 +
              </button>

              <div className={styles.voteOptions}>
                <label className={styles.voteCheckbox}>
                  <input
                    type="checkbox"
                    checked={multipleChoice}
                    onChange={(e) => setMultipleChoice(e.target.checked)}
                  />
                  복수선택
                </label>

                <div className={styles.voteDateWrapper}>
                  <img src={CalIcon} alt="달력" />
                  <span>마감 날짜</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.voteDateInput}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            글 발행하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPostPage;
