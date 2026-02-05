import { useState } from "react";
import AdminPanel from "./_components/admin-panel/admin-panel";
import Sidebar from "./_components/sidebar/sidebar";
import "./page.scss";
import { SIDEBAR_TYPES } from "./_components/sidebar/sidebar.data";

export default function AdminPage() {
  const [contentType, setContentType] = useState(SIDEBAR_TYPES[0]);
  return (
    <div className="admin-page">
      <Sidebar type={contentType} onClick={(type) => setContentType(type)} />
      <AdminPanel type={contentType} />
    </div>
  );
}
