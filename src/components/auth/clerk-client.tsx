"use client";

import type { PropsWithChildren } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/react";

function SignedIn({ children }: PropsWithChildren) {
  return <Show when="signed-in">{children}</Show>;
}

function SignedOut({ children }: PropsWithChildren) {
  return <Show when="signed-out">{children}</Show>;
}

export {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
};
