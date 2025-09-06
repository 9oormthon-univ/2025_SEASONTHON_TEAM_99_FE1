import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

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
import BackToList from "./components/BacktoList";
function App() {
  const location = useLocation();
  const { pathname } = location;
  const isDetailPage = /^\/(report|policy|community)\/.+/.test(pathname);

  return (
    <div className="App">
      <Header />
      {isDetailPage && <BackToList />}
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
