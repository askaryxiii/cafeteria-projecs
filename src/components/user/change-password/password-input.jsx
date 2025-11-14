import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoAlertCircle } from "react-icons/io5";

import { useFormContext } from "react-hook-form";

export function PasswordInput({ name, placeholder, validation }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const error = errors[name];

  return (
    <>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name, {
            required: `${placeholder} is required`,
            ...validation,
          })}
          className={`w-full rounded-xl bg-[#CECECE] px-3 py-2.5 text-white placeholder-white outline-none transition-all duration-200 focus:ring-2 ${
            error ? "focus:ring-red-700" : "focus:ring-[#032552]"
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? (
            <IoEyeOffOutline size={22} />
          ) : (
            <IoEyeOutline size={22} />
          )}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2">
          <IoAlertCircle size={18} className="text-red-600 shrink-0" />
          <p className="text-xs text-red-600">{error.message}</p>
        </div>
      )}
    </>
  );
}
