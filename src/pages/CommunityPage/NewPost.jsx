import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import CustomDropdown from "../../components/CustomDropdown";
import styles from "./NewPost.module.css";

const MAX_IMAGES = 3;

const REGION_OPTIONS_FOR_NEW_POST = [
  // ... (지역 옵션은 기존과 동일)
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

  // 단일 파일에서 파일 배열로 상태 변경
  const [imageFile, setImageFile] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

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

    try {
      const response = await axiosInstance.post("/posts/new", formData, {
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
        {/* ... (제목, 지역, 내용 input 그룹은 기존과 동일) ... */}
        <div className={styles.inputGroup}>
                   {" "}
          <label htmlFor="title" className={styles.label}>
                        제목          {" "}
          </label>
                   {" "}
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            style={{ height: "82px" }}
          />
                 {" "}
        </div>
               {" "}
        <div className={styles.inputGroup}>
                   {" "}
          <label htmlFor="region" className={styles.label}>
                        지역          {" "}
          </label>
                   {" "}
          <div className={styles.dropdownContainer}>
                       {" "}
            <CustomDropdown
              options={REGION_OPTIONS_FOR_NEW_POST}
              currentRegion={regionId}
              onRegionChange={handleRegionChange}
            />
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className={styles.inputGroup}>
                   {" "}
          <label htmlFor="content" className={styles.label}>
                        내용          {" "}
          </label>
                   {" "}
          <textarea
            id="content"
            placeholder="청년 정책과 관련된 경험이나 정보를 공유해보세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
                 {" "}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>사진</label>
          <div className={styles.imageSection}>
            {/* 선택된 이미지 미리보기 렌더링 */}
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

            {/* 이미지가 3장 미만일 때만 업로드 버튼 표시 */}
            {imageFile.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={handleImageUploadClick}
                className={styles.imageUploadButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="17 8 12 3 7 8"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="15"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  사진 추가하기
                  <br />({imageFile.length}/{MAX_IMAGES})
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
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">익명</label>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            발행
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPostPage;
