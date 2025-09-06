import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import CommentsSection from "../../components/CommentSection";
import styles from "./PostDetail.module.css";

function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [vote, setVote] = useState(null); // ✅ 투표 상태
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 + 투표 조회
  useEffect(() => {
    const fetchPostAndVote = async () => {
      try {
        // 게시글 상세
        const postRes = await axiosInstance.get(`/posts/${postId}`);
        setPost(postRes.data.result);

        // ✅ 투표 조회 API 호출
        try {
          const voteRes = await axiosInstance.get(`/posts/vote/${postId}/read`);
          setVote(voteRes.data.result); // 투표 없으면 catch로 넘어감
        } catch (e) {
          setVote(null); // 투표 없는 경우 null 처리
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndVote();
  }, [postId]);

  // 선택 처리
  const handleVoteChange = (optionId) => {
    if (!vote) return;

    if (vote.multipleChoice) {
      // 복수 선택
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // 단일 선택
      setSelectedOptions([optionId]);
    }
  };

  // 투표 제출
  const handleVoteSubmit = async () => {
    if (selectedOptions.length === 0) {
      alert("투표할 항목을 선택하세요.");
      return;
    }

    try {
      await axiosInstance.post("/posts/vote/do-vote", {
        voteId: vote.voteId,
        optionIds: selectedOptions,
      });

      // ✅ 투표 다시 불러오기
      const refreshed = await axiosInstance.get(`/posts/vote/${postId}/read`);
      setVote(refreshed.data.result);

      setSelectedOptions(selectedOptions); // 선택 유지
    } catch (err) {
      alert("투표 실패: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error.message}</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.policydetail}>
          <div className={styles.title}>
            <h1>{post.title}</h1>
            <div className={styles.titleMeta}>
              <div className={styles.location}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 16.6668C12.5 14.0002 15 11.6123 15 8.66683C15 5.72131 12.7614 3.3335 10 3.3335C7.23858 3.3335 5 5.72131 5 8.66683C5 11.6123 7.5 14.0002 10 16.6668Z"
                    stroke="#F5F5F5"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="9.99992"
                    cy="8.33317"
                    r="1.66667"
                    fill="#F5F5F5"
                  />
                </svg>
                <span>{post.regionName}</span>
              </div>
              <div className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.content}>{post.content}</div>

            {/* ✅ 이미지가 있으면 가로 3장 배치 */}
            {post.postImages?.length > 0 && (
              <div className={styles.imageContainer}>
                {post.postImages.map((image, idx) => (
                  <img
                    key={idx}
                    src={image.imageUrl}
                    alt={image.originalName || `post image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            {vote && (
              <>
                <div className={styles.voteTitle}>투표</div>
                <div className={styles.voteBox}>
                  <h3 className={styles.voteQuestion}>{vote.question}</h3>
                  <div className={styles.voteOptions}>
                    {vote.options.map((opt) => (
                      <label key={opt.optionId} className={styles.voteOption}>
                        <input
                          type={vote.multipleChoice ? "checkbox" : "radio"}
                          name="vote"
                          checked={selectedOptions.includes(opt.optionId)}
                          onChange={() => handleVoteChange(opt.optionId)}
                          className={styles.voteInput}
                        />
                        <span>{opt.optionText}</span>
                        <span className={styles.voteCount}>
                          {opt.voteCount}표
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    className={styles.voteButton}
                    onClick={handleVoteSubmit}
                  >
                    투표하기
                  </button>
                </div>
              </>
            )}
          </div>

          <hr />
        </div>

        {/* ✅ 투표 (vote가 존재할 때만 보이게) */}

        {/* 댓글 */}
        <CommentsSection type="post" id={postId} />
      </div>
    </div>
  );
}

export default PostDetailPage;
