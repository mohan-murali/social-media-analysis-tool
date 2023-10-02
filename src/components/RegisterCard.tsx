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

export const initialRegisterState = {
  name: "",
  nameError: "",
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
};

export const registerReducer = (state: any, action: any) => {
  switch (action.type) {
    case "emailError":
      return { ...state, emailError: action.error };
    case "passwordError":
      return { ...state, passwordError: action.error };
    case "nameError":
      return { ...state, nameError: action.error };
    case "email":
      return { ...state, email: action.email, emailError: "" };
    case "password":
      return { ...state, password: action.password, passwordError: "" };
    case "name":
      return { ...state, name: action.name, nameError: "" };
  }
};

export interface RegisterCardProps {
  handleSignInClick: (e: any) => void;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  handleSignInClick,
}) => {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const router = useRouter();
  const { register } = useAuth();

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
    if (!state.name) {
      dispatch({ type: "nameError", error: "name is mandatory" });
      isError = true;
    }
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailRegex.test(state.email)) {
      isError = true;
      dispatch({ type: "emailError", error: "please supply valid email" });
    }
    if (state.password?.length < 5) {
      isError = true;
      dispatch({
        type: "passwordError",
        error: "password must be atleast 5 characters long",
      });
    }

    if (!isError) {
      const data = {
        email: state.email,
        password: state.password,
        name: state.name,
      };
      register(data);
    }
  };

  const onNameChange = (e: any) => {
    dispatch({ type: "name", name: e.target.value });
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
          Sign Up
        </Typography>
      </CardHeader>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to register.
      </Typography>
      <form
        className="mt-8 mx-2 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 h-60 flex flex-col gap-6">
          <div>
            <Input
              size="md"
              label="Name"
              value={state.name}
              onChange={onNameChange}
              error={!!state.nameError}
            />
            {!!state.nameError && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                <InformationCircleIcon className="w-4 h-4 -mt-px" />
                {state.nameError}
              </Typography>
            )}
          </div>
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
          Register
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a
            href="#"
            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
            onClick={handleSignInClick}
          >
            Sign In
          </a>
        </Typography>
      </form>
    </Card>
  );
};
