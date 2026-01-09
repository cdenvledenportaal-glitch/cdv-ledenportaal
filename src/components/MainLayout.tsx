import { useAuth } from "../auth/AuthProvider";

function MainLayout() {
  const { profile } = useAuth();

  return (
    <div className="main-layout">
      <h1>Welkom {profile?.voornaam}</h1>
      <p>Rol: {profile?.rol}</p>
      {/* Add your main application layout here */}
    </div>
  );
}

export default MainLayout;
