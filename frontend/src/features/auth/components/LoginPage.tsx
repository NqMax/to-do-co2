import { Link } from "react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-muted-foreground mt-7 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="login-form" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
