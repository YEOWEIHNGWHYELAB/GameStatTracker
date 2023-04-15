import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import GamesDetails from "./pages/Games/GameDetails";
import SignUp from "./pages/Auth/SignUp"
import SignIn from "./pages/Auth/SignIn"
import AuthContextProvider from "./contexts/AuthContextProvider";
import RequireAuth from "./components/RequireAuth";
import RequireNotAuth from "./components/RequireNotAuth";
import BaseLayout from "./components/BaseLayout";
import GameStat from "./pages/GameStat";
import GameStatDetails from "./pages/GameStat/GameStatDetails";
import "./index.css";
import RequestResetPassword from "./pages/Auth/RequestResetPassword";
import ResetPasswordConfirm from "./pages/Auth/ResetPasswordConfirm";
import ThemeModeProvider from "./contexts/ThemeModeProvider";

export default function App() {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      <AuthContextProvider>
        <SnackbarProvider>
          <Router>
            <Box sx={{
              bgcolor: (theme) => theme.palette.background.default, minHeight: "100vh", width: "100%"
            }}>
              <Routes>
                <Route element={<RequireAuth />}>
                  <Route element={<BaseLayout />}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/game" element={<Games />} />
                    <Route path="/game/create" element={<GamesDetails />} />
                    <Route path={`/game/edit/:id`} element={<GamesDetails />} />
                    <Route path="/gamestat" element={<GameStat />} />
                    <Route path="/gamestat/create" element={<GameStatDetails />} />
                    <Route path="/gamestat/edit/:id" element={<GameStatDetails />} />
                  </Route>
                </Route>
                <Route element={<RequireNotAuth />} >
                  <Route path={"/auth/signup"} element={<SignUp />} />
                  <Route path={"/auth/signin"} element={<SignIn />} />
                  <Route path={"/auth/password-reset"} element={<RequestResetPassword />} />
                  <Route path={"/auth/password-reset/confirm/:uid/:token"} element={<ResetPasswordConfirm />} />
                </Route>
              </Routes>
            </Box>
          </Router>
        </SnackbarProvider>
      </AuthContextProvider>
    </ThemeModeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
