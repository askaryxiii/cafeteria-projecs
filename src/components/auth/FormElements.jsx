import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// small className join helper similar to `cn`
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const InputRow = ({ customClass, children }) => (
  <div className={cn("input-row gap-responsive-sm", customClass)}>
    {children}
  </div>
);

// TextInput: if `icon` prop is provided, render IconInput so the icon appears inside the input
export const TextInput = React.forwardRef(
  (
    {
      icon,
      iconPosition,
      iconClassName,
      containerClassName,
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    if (icon) {
      return (
        <IconInput
          ref={ref}
          icon={icon}
          iconPosition={iconPosition}
          iconClassName={iconClassName}
          containerClassName={containerClassName}
          showIcon={showIcon}
          className={className}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref}
        className={cn("input-field text-responsive-sm", className)}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export const PasswordInput = React.forwardRef(
  (
    {
      iconPosition = "right",
      iconClassName,
      containerClassName,
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <IconInput
        ref={ref}
        icon={
          showPassword ? (
            <FaLockOpen className="w-5 h-5" />
          ) : (
            <FaLock className="w-5 h-5" />
          )
        }
        iconPosition={iconPosition}
        iconClassName={iconClassName}
        containerClassName={containerClassName}
        showIcon={showIcon}
        className={className}
        type={showPassword ? "text" : "password"}
        onIconClick={togglePassword}
        iconClickable
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export const PrimaryButton = ({ children, className, ...props }) => (
  <button
    className={cn(
      "btn-primary btn-responsive transition-all duration-200",
      className
    )}
    {...props}>
    {children}
  </button>
);

// IconInput: forwardRef wrapper that matches the design you provided
const IconInput = React.forwardRef(
  (
    {
      icon = <MdEmail className="icon-responsive-sm" />,
      iconPosition = "right",
      iconClassName,
      containerClassName,
      showIcon = true,
      className,
      onIconClick,
      iconClickable = false,
      ...props
    },
    ref
  ) => {
    const IconWrapper = ({ children }) => (
      <div
        onClick={iconClickable ? onIconClick : undefined}
        className={cn(
          "flex items-center justify-center px-2 sm:px-3 md:px-4",
          iconClickable && "cursor-pointer hover:text-slate-900",
          iconPosition === "left"
            ? "bg-slate-100 text-slate-600 border-r border-slate-300"
            : "text-slate-600 border-l border-slate-300",
          iconClassName
        )}>
        {children}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center rounded-lg sm:rounded-xl overflow-hidden border border-slate-300 bg-slate-50 ring-offset-background focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-all",
          containerClassName
        )}>
        {showIcon && iconPosition === "left" && (
          <IconWrapper>{icon}</IconWrapper>
        )}

        <input
          className={cn(
            "flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent text-slate-900 placeholder:text-slate-500 outline-none font-medium text-sm sm:text-base",
            className
          )}
          {...props}
        />

        {showIcon && iconPosition === "right" && (
          <IconWrapper>{icon}</IconWrapper>
        )}
      </div>
    );
  }
);

IconInput.displayName = "IconInput";

export { IconInput };
