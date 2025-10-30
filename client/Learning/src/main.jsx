import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import SchemesList from "./components/SchemesList/SchemesList.jsx";
import SavedSchemes from "./components/SchemesList/SavedSchemes.jsx";
import Layout from "./Layout.jsx";
import Maps from "./components/Maps/Maps.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import SchemeDetail from "./components/SchemesList/SchemeDetail/SchemeDetail.jsx";
import Eligibility from "./components/SchemesList/SchemeDetail/Eligibility.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import Profile from "./components/Profile/Profile.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Dashboard />} />
      <Route path="schemes" element={<SchemesList />} />
      <Route path="schemes/:schemeId" element={<SchemeDetail />} />
      <Route path="schemes/:schemeId/eligibility" element={<Eligibility />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="maps" element={<Maps />} />
      <Route
        path="saved-schemes"
        element={
          <RequireAuth>
            <SavedSchemes />
          </RequireAuth>
        }
      />
      <Route
        path="profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">404</h1>
                <p className="py-6">Page not found!</p>
                <a href="/" className="btn btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          </div>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
