import { Link } from "react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-muted-foreground mt-7 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="register-form" className="w-full">
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
