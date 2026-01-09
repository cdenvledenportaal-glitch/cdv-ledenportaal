import { AuthProvider, useAuth } from "./auth/AuthProvider";
import Login from "./auth/login";
import Require2FA from "./auth/Require2FA";
import MainLayout from "./components/MainLayout";

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) return <p>Laden...</p>;
  if (!session) return <Login />;

  return (
    <Require2FA>
      <MainLayout />
    </Require2FA>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
