import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import { Route, Routes } from "react-router";
import { UserList } from "@/pages/UserList";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RavenMatrixPage />} />
      <Route path="/users" element={<UserList />} />
    </Routes>
  );
};
