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
          className={`w-full rounded-lg bg-light-grey px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-navy-dark placeholder-darktext-navy-dark outline-none transition-all duration-200 focus:ring-2 min-h-9 sm:min-h-10 md:min-h-11 ${
            error ? "focus:ring-red-700" : "focus:ring-primary-navy"
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-dark-grey hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? (
            <IoEyeOffOutline className="w-5 sm:w-5.5 md:w-6 h-5 sm:h-5.5 md:h-6" />
          ) : (
            <IoEyeOutline className="w-5 sm:w-5.5 md:w-6 h-5 sm:h-5.5 md:h-6" />
          )}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <IoAlertCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-red-600 shrink-0" />
          <p className="text-xs sm:text-xs md:text-sm text-red-600">
            {error.message}
          </p>
        </div>
      )}
    </>
  );
}
