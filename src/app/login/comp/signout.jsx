'use client';
import { useEffect } from "react";
import { useAuth } from "@/comp/utility/tanstack/authContext";
import { useRouter } from "next/navigation";

const Signout = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
          if (!user) {
            router.push("/");
          }
        }, [user, router]);

  return (
    <button onClick={logout} className="btn btn-error btn-soft">
      Sign Out
    </button>
  );
}

export default Signout