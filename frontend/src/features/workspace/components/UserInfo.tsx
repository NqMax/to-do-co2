import { useUserStore } from "@/lib/store";
import { useNavigate } from "react-router";
import { useLogout } from "@/features/auth/api/mutations";
import { departmentLabels, roleLabels } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserInfo() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearUser();
        navigate("/login");
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="mx-2 h-auto p-1.5" variant="ghost">
          <div className="size-9 rounded-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%" />
          <div className="flex flex-col justify-center text-start">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs font-normal">
              {departmentLabels[user.department]} - {roleLabels[user.role]}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="start">
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
