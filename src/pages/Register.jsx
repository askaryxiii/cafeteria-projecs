import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { BsVectorPen } from "react-icons/bs";
import { GoUnlock } from "react-icons/go";

const Register = () => {
  const { register: formRegister, handleSubmit } = useForm();
  const { register: registerFn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
      const res = await registerFn(data);
      // if backend only returns a success message, redirect to login
      if (res && res.message && /created/i.test(res.message)) {
        toast.success(res.message, {
          style: {
            border: "1px solid #001743",
            padding: "16px",
            color: "#001743",
          },
          iconTheme: {
            primary: "#001743",
            secondary: "#FFFAEE",
          },
        });
        navigate("/login");
        return;
      }

      // otherwise, if backend returned full auth info, redirect based on role
      redirectByRole(res);
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputRow>
          <TextInput
            placeholder="Full Name in English"
            icon={<BsVectorPen className="w-5 h-5" />}
            {...formRegister("name", { required: true })}
          />
        </InputRow>

        <InputRow>
          <TextInput
            placeholder="الاسم بالكامل بالعربيه"
            icon={<BsVectorPen className="w-5 h-5" />}
            {...formRegister("arabic_name", { required: true })}
          />
        </InputRow>

        <InputRow>
          <TextInput
            placeholder="Email Address"
            icon={<IoMailOutline className="w-5 h-5" />}
            {...formRegister("email", { required: true })}
          />
        </InputRow>

        <InputRow>
          <PasswordInput
            placeholder="Password"
            icon={<GoUnlock className="w-5 h-5" />}
            {...formRegister("password", { required: true })}
          />
        </InputRow>

        <InputRow>
          <PasswordInput
            placeholder="Confirm Password"
            icon={<GoUnlock className="w-5 h-5" />}
            {...formRegister("confirmPassword", { required: true })}
          />
        </InputRow>

        {error && <div className="text-red-400 mb-2">{error}</div>}

        <InputRow customClass={"flex justify-center"}>
          <PrimaryButton type="submit">SAVE</PrimaryButton>
        </InputRow>
      </form>
      <div className="mt-4 flex justify-center">
        <Link to="/login" className="link-muted uppercase">
          login to existing account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
