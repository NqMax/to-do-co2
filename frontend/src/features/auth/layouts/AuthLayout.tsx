import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Outlet } from "react-router";
import { validateSession } from "@/features/auth/api/requests";
import { Loading } from "@/components/global-state/Loading";
import { useUserStore } from "@/lib/store";

export function AuthLayout() {
  const updateUser = useUserStore((state) => state.updateUser);
  const navigate = useNavigate();

  const { isPending, isError, data } = useQuery({
    queryKey: ["validateSession"],
    queryFn: validateSession,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }

    if (data) {
      updateUser(data);
    }
  }, [data, isError]);

  if (isPending || isError) {
    return <Loading />;
  }

  return <Outlet />;
}
