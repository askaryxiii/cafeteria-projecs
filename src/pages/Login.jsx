import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import {
  InputRow,
  TextInput,
  PasswordInput,
  PrimaryButton,
} from "../components/auth/FormElements";
import { IoMailOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";

const Login = () => {
  const { register: formRegister, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);

  const redirectByRole = (res) => {
    const role = res.user?.role || res.role || "user";
    switch (role) {
      case "chef":
        navigate("/chef");
        break;
      case "accountant":
        navigate("/accountant");
        break;
      case "cafeteria":
        navigate("/cafeteria");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/user");
    }
  };

  const onSubmit = async (data) => {
    setError(null);
    try {
      const res = await login(data, remember);
      redirectByRole(res);
    } catch (e) {
      console.log(e.error);
      setError(e.message);
      toast.error(e.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="WELCOME" sub="TO YOUR FAVOURITE DELICIOS FOOD">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputRow>
          <TextInput
            placeholder="Email Address"
            icon={<IoMailOutline className="w-5 h-5" />}
            {...formRegister("email", { required: true })}
          />
        </InputRow>

        <InputRow label="Password">
          <PasswordInput
            placeholder="Password"
            icon={<GoUnlock className="w-5 h-5" />}
            {...formRegister("password", { required: true })}
          />
        </InputRow>

        <InputRow>
          <label className="small-note">
            <input
              type="checkbox"
              {...formRegister("remember")}
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            &nbsp; Save Password
          </label>
        </InputRow>

        <InputRow customClass={"flex justify-center"}>
          <PrimaryButton type="submit">LOGIN</PrimaryButton>
        </InputRow>
      </form>

      <div className="mt-4 flex justify-center">
        <Link to="/register" className="link-muted">
          REGISTER NEW ACCOUNT
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
