import React from "react";
import Link from "next/link";
import { useAuth } from "@/comp/utility/tanstack/authContext";

const HeaderLinks = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <li className="font-bold">
        <Link href="/dashboard">Dashboard</Link>
      </li>
      <li className="font-bold">
        <Link href="/journal">Journal</Link>
      </li>
      <li className="font-bold">
        <Link href="/habits">Habits</Link>
      </li>
      <li className="font-bold">
        <Link href="/bookmarks">Bookmarks</Link>
      </li>
      <li className="font-bold">
        <Link href="/settings">Settings</Link>
      </li>
    </>
  );
};

export default HeaderLinks;
