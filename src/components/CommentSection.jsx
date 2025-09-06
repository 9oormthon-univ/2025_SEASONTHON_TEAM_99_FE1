import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import styles from "./CommentSection.module.css";
import heartIconUrl from "../assets/heart.svg";
import fullHeartIconUrl from "../assets/fullheart.svg";

function CommentItem({ comment, onLikeToggle, onUpdate, onDelete }) {
  const { user } = useAuth();
  const authorName = comment.writer;
  const isMyComment = user && user.nickname === authorName;
  const commentId = comment.id || comment.replyId;

  const likeCount = comment.likeCount;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentItemArea}>
        <div className={styles.commentItemInfo}>
          <span className={styles.commentName}>
            {comment.writer && !comment.anonymous ? comment.writer : "익명"}
          </span>
          {comment.createdAt && (
            <span className={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          )}
        </div>
        <div className={styles.commentItemSub}>
          <button disabled={!user} onClick={() => onLikeToggle(commentId)}>
            <img
              src={likeCount > 0 ? fullHeartIconUrl : heartIconUrl}
              alt="좋아요"
              className={`${styles.icon} ${likeCount > 0 ? styles.liked : ""}`}
            />
            <span className={`${likeCount > 0 ? styles.liked : ""}`}>
              {likeCount}
            </span>
          </button>
          {isMyComment && (
            <div>
              <button onClick={() => onUpdate(commentId, comment.content)}>
                수정
              </button>
              <button onClick={() => onDelete(commentId)}>삭제</button>
            </div>
          )}
        </div>
      </div>
      <p className={styles.commentItemContent}>{comment.content}</p>
    </div>
  );
}

function CommentsSection({ type, id, metadata }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      let response;
      if (type === "policy") {
        response = await axiosInstance.get("/youth/policies/reply-list", {
          params: { plcyNo: id },
        });
      } else if (type === "post") {
        response = await axiosInstance.get(`/posts/replies/${id}`);
      } else {
        throw new Error("유효하지 않은 댓글 타입입니다.");
      }
      if (response.data && response.data.isSuccess) {
        setComments(response.data.result || []);
      }
    } catch (err) {
      console.error("댓글 로딩 실패:", err);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id, type]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      let url = "";
      let requestBody = {};
      let config = {};
      if (type === "policy") {
        url = "/youth/policies/create";
        requestBody = {
          content: newComment,
          plcyNo: id,
          plcyNm: metadata?.plcyNm,
        };
        config = { params: { isAnonymous } };
      } else if (type === "post") {
        url = `/posts/replies/${id}`;
        requestBody = { content: newComment };
        config = { params: { isAnonymous } };
      } else {
        throw new Error("유효하지 않은 댓글 타입입니다.");
      }
      await axiosInstance.post(url, requestBody, config);
      setNewComment("");
      setIsAnonymous(false);
      fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert(err.response?.data?.message || "댓글 등록에 실패했습니다.");
    }
  };

  const handleLikeToggle = async (commentId) => {
    try {
      let toggleUrl = "";
      let getCountUrl = "";
      if (type === "policy") {
        toggleUrl = `/youth/policies/replies/${commentId}/like`;
        getCountUrl = `/youth/policies/replies/${commentId}/likes`;
      } else if (type === "post") {
        toggleUrl = `/posts/replies/${commentId}/like`;
        getCountUrl = `/posts/replies/${commentId}/like-count`;
      } else {
        throw new Error("유효하지 않은 댓글 타입입니다.");
      }
      await axiosInstance.post(toggleUrl);
      const response = await axiosInstance.get(getCountUrl);
      if (response.data && response.data.isSuccess) {
        const newLikeCount = response.data.result;
        setComments((currentComments) =>
          currentComments.map((comment) => {
            const currentCommentId = comment.id || comment.replyId;
            if (currentCommentId === commentId) {
              return { ...comment, likeCount: newLikeCount };
            }
            return comment;
          })
        );
      }
    } catch (err) {
      //좋아요 처리
      console.error("좋아요 처리 실패:", err.response);
    }
  };

  const handleCommentDelete = async (commentId) => {
    alert("삭제 API 연동 필요");
  };
  const handleCommentUpdate = async (commentId, currentContent) => {
    alert("수정 API 연동 필요");
  };

  return (
    <section className={styles.commentContainer}>
      <h2 className={styles.commentTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <path
            d="M13.9995 4.66669L13.9995 3.66669H13.9995V4.66669ZM23.3325 13.9997L24.3325 13.9997V13.9997H23.3325ZM21.772 19.1647L20.9396 18.6105C20.7615 18.878 20.7228 19.2148 20.8356 19.5158L21.772 19.1647ZM23.3345 23.3327L22.9831 24.2689C23.3503 24.4067 23.7641 24.3172 24.0415 24.0399C24.3188 23.7627 24.4085 23.3489 24.2708 22.9817L23.3345 23.3327ZM19.1685 21.7692L19.5198 20.833C19.2186 20.72 18.8815 20.7587 18.6138 20.9372L19.1685 21.7692ZM13.9995 23.3327V24.3327H13.9995L13.9995 23.3327ZM4.6665 13.9997H3.6665V13.9997L4.6665 13.9997ZM13.9995 4.66669L13.9995 5.66669C18.6016 5.66674 22.3325 9.39761 22.3325 13.9997H23.3325H24.3325C24.3325 8.29302 19.7062 3.66675 13.9995 3.66669L13.9995 4.66669ZM23.3325 13.9997L22.3325 13.9997C22.3325 15.7061 21.819 17.2898 20.9396 18.6105L21.772 19.1647L22.6043 19.719C23.6948 18.0813 24.3325 16.114 24.3325 13.9997L23.3325 13.9997ZM21.772 19.1647L20.8356 19.5158L22.3981 23.6837L23.3345 23.3327L24.2708 22.9817L22.7083 18.8137L21.772 19.1647ZM23.3345 23.3327L23.6858 22.3965L19.5198 20.833L19.1685 21.7692L18.8171 22.7055L22.9831 24.2689L23.3345 23.3327ZM19.1685 21.7692L18.6138 20.9372C17.2923 21.8181 15.7074 22.3327 13.9995 22.3327L13.9995 23.3327L13.9995 24.3327C16.1159 24.3327 18.0846 23.6936 19.7231 22.6013L19.1685 21.7692ZM13.9995 23.3327V22.3327C9.39743 22.3327 5.66656 18.6018 5.6665 13.9997L4.6665 13.9997L3.6665 13.9997C3.66657 19.7063 8.29283 24.3327 13.9995 24.3327V23.3327ZM4.6665 13.9997H5.6665C5.6665 9.39756 9.39738 5.66669 13.9995 5.66669V4.66669V3.66669C8.29281 3.66669 3.6665 8.29299 3.6665 13.9997H4.6665Z"
            fill="#111111"
          />
        </svg>
        댓글 ({comments.length})
      </h2>
      <div className={styles.commentFormArea}>
        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="의견을 남겨주세요."
            />
            <div className={styles.commentExtraArea}>
              <button type="submit">작성하기</button>
            </div>
          </form>
        ) : (
          <p>
            댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
          </p>
        )}
      </div>
      <div>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading &&
          !error &&
          (comments.length > 0
            ? comments.map((comment) => (
                <CommentItem
                  key={comment.id || comment.replyId}
                  comment={comment}
                  onLikeToggle={handleLikeToggle}
                  onDelete={handleCommentDelete}
                  onUpdate={handleCommentUpdate}
                />
              ))
            : "")}
      </div>
    </section>
  );
}

export default CommentsSection;
