import { LoginCard } from "@/components/LoginCard";
import { RegisterCard } from "@/components/RegisterCard";
import { useAuth } from "@/hooks/useAuth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Register: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSignInClick = (e: any) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  const router = useRouter();
  const { isTokenAvailable } = useAuth();

  useEffect(() => {
    if (isTokenAvailable) {
      router.push("/");
    }
  }, [isTokenAvailable, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
      {isLogin ? (
        <LoginCard handleSignInClick={handleSignInClick} />
      ) : (
        <RegisterCard handleSignInClick={handleSignInClick} />
      )}
    </div>
  );
};

export default Register;
