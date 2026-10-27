import { requireAdmin } from "@/lib/require-admin";

const AdminPage = async () => {
  await requireAdmin();
  return <div>AdminPage</div>;
};

export default AdminPage;
