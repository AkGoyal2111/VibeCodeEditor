"use client";

import React from 'react'
import { LogoutButtonProps } from '../types'
import { signOut } from 'next-auth/react';

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onLogout = async () => {
    // Explicit redirect so the session cookie is cleared and the user lands
    // back on the landing page even from a protected route.
    await signOut({ redirectTo: "/" });
  };

  return (
    <span
      className="cursor-pointer"
      onClick={onLogout}
      // Radix closes the menu on item select before the span's click can fire;
      // handle pointer/select here too so logout always triggers.
      onPointerDown={(e) => {
        e.preventDefault();
        onLogout();
      }}
    >
      {children}
    </span>
  );
};

export default LogoutButton
