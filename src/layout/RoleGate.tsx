import { useAuth } from "../auth/AuthProvider";

interface RoleGateProps {
  allow: string[];
  children: React.ReactNode;
}

function RoleGate({ allow, children }: RoleGateProps) {
  const { profile } = useAuth();
  if (!allow.includes(profile?.rol)) return null;
  return children;
}
