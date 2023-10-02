import { useAuth } from "@/hooks/useAuth";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { initialRegisterState, registerReducer } from "./RegisterCard";

export interface LoginCardProps {
  handleSignInClick: (e: any) => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ handleSignInClick }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const { login } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let isError = false;

    if (!state.email) {
      dispatch({ type: "emailError", error: "email is mandatory" });
      isError = true;
    }
    if (!state.password) {
      dispatch({ type: "passwordError", error: "password is mandatory" });
      isError = true;
    }
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailRegex.test(state.email)) {
      isError = true;
      dispatch({ type: "emailError", error: "please supply valid email" });
    }

    if (!isError) {
      const data = {
        email: state.email,
        password: state.password,
      };
      login(data);
    }
  };

  const onPasswordChange = (e: any) => {
    dispatch({ type: "password", password: e.target.value });
  };

  const onEmailChange = (e: any) => {
    dispatch({ type: "email", email: e.target.value });
  };

  return (
    <Card className="flex items-center bg-white">
      <CardHeader
        variant="gradient"
        color="purple"
        className="mb-4 grid h-20 w-32 place-items-center"
      >
        <Typography variant="h4" color="white" className="mx-2">
          Login
        </Typography>
      </CardHeader>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your login details.
      </Typography>
      <form
        className="mt-8 mx-2 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 h-52 flex flex-col gap-6">
          <div>
            <Input
              size="lg"
              label="Email"
              value={state.email}
              onChange={onEmailChange}
            />
            {!!state.emailError && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {state.emailError}
              </Typography>
            )}
          </div>
          <div>
            <Input
              type="password"
              size="lg"
              label="Password"
              value={state.password}
              onChange={onPasswordChange}
            />
            {!!state.passwordError && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {state.passwordError}
              </Typography>
            )}
          </div>
        </div>
        <Button type="submit" className="mt-6" color="purple" fullWidth>
          Login
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Register for new account{" "}
          <a
            href="#"
            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
            onClick={handleSignInClick}
          >
            Register
          </a>
        </Typography>
      </form>
    </Card>
  );
};
