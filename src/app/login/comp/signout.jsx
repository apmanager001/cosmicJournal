'use client';
import { useAuth } from "@/comp/utility/tanstack/authContext";

const Signout = () => {
    const { logout } = useAuth();

  return (
    <button onClick={logout} className="btn btn-error btn-soft btn-sm md:btn-md">
      Sign Out
    </button>
  );
}

export default Signout