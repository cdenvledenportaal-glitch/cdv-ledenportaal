import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthProvider";

type Require2FAProps = {
  children: React.ReactNode;
};

export default function Require2FA({ children }: Require2FAProps) {
  const { profile } = useAuth();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function check() {
      const { data, error } = await supabase.auth.mfa.listFactors();
      const has2FA = data?.totp && data.totp.length > 0;

      if (error) {
        console.error('Error fetching MFA factors:', error);
        setOk(false);
        return;
      }

      if (!profile?.twofa_required) {
        setOk(true);
        return;
      }

      setOk(!!has2FA);
    }

    check();
  }, [profile]);

  if (!ok) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Extra beveiliging vereist</h2>
        <p>
          Voor jouw rol is tweestapsverificatie verplicht.
        </p>
        <button
          onClick={() => supabase.auth.mfa.enroll({ factorType: "totp" })}
        >
          2FA instellen
        </button>
      </div>
    );
  }

  return children;
}
