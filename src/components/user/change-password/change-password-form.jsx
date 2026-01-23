import { FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "./password-input";
import { IoLockOpen } from "react-icons/io5";
import { changePassword, readToken } from "../../../lib/apis";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const passwordValidation = {
    minLength: {
      value: 8,
      message: "The password requires a minimum of 8 characters.",
    },
    validate: {
      hasCapital: (value) =>
        /[A-Z]/.test(value) ||
        "The password must contain at least one capital letter.",
      hasNumber: (value) =>
        /[0-9]/.test(value) || "The password must contain at least one number.",
    },
  };

  const newPasswordValue = methods.watch("newPassword");

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      setIsLoading(true);
      const token = readToken();
      if (!token) {
        toast.error("No auth token found");
        return;
      }

      const res = await changePassword(currentPassword, newPassword, token);
      if (res && res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Password changed successfully");
      methods.reset();
      navigate("/user", { replace: true });
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2 sm:p-3 md:p-4">
      <div className="w-full max-w-md rounded-lg bg-primary-navy px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 shadow-xl">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl font-semibold text-light-grey">
            <IoLockOpen className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" />
            Change Password
            <IoLockOpen className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" />
          </h1>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5 md:space-y-6">
            <PasswordInput
              name="currentPassword"
              placeholder="Current Password"
            />

            <PasswordInput
              name="newPassword"
              placeholder="New Password"
              validation={passwordValidation}
            />

            <PasswordInput
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              validation={{
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              }}
            />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-light-grey px-6 sm:px-8 md:px-10 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold text-primary-navy transition-all duration-200 hover:bg-gray-400 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-9 sm:min-h-10 md:min-h-11">
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
