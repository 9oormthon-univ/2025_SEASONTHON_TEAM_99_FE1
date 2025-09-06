import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css"; // CSS 모듈 import

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import PolicyPage from "./pages/PolicyPage/PolicyPage";
import PolicyDetailPage from "./pages/PolicyDetailPage/PolicyDetailPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import CommunityList from "./pages/CommunityPage/CommunityPage";
import NewPost from "./pages/CommunityPage/NewPost";
import PostDetail from "./pages/CommunityPage/PostDetail";
import ReportDetailPage from "./pages/ReportPage/ReportDetailPage";
function App() {
  return (
    <div className="App">
      <Header />

      <main className="mainContent">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/policies" element={<PolicyPage />} />
          <Route path="/policies/:policyName" element={<PolicyDetailPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/:reportId" element={<ReportDetailPage />} />

          <Route path="/community" element={<CommunityList />} />
          <Route path="/community/new" element={<NewPost />} />
          <Route path="/community/:postId" element={<PostDetail />} />
          <Route path="/" element={<Navigate to="/policies" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
