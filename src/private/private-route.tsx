import {Loading} from "@/components/loading";
import { useAuthStore } from "@/store/auth-store";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type Roles = "admin" | "student";

interface IProps {
  children: ReactNode;
  roles: Roles[];
}

export default function PrivateRoute({ roles, children }: IProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (user === undefined) {
    return <Loading />;
  }

  if (user === null) {
    navigate("/auth/login");
    return null;
  }

  if (user?.role && !roles.includes(user?.role)) {
    return null;
  }

  return children;
}