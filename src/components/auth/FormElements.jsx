import React from "react";
import { MdEmail } from "react-icons/md";

// small className join helper similar to `cn`
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const InputRow = ({ customClass, children }) => (
  <div className={`input-row ${customClass}`}>{children}</div>
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
      <input ref={ref} className={cn("input-field", className)} {...props} />
    );
  }
);

TextInput.displayName = "TextInput";

export const PasswordInput = React.forwardRef(
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
          type="password" // ✅ move type after spreading props
        />
      );
    }

    return (
      <input
        {...props}
        type="password"
        className={`input-field ${className || ""}`}
        ref={ref}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export const PrimaryButton = ({ children, ...props }) => (
  <button className="btn-primary " {...props}>
    {children}
  </button>
);

// IconInput: forwardRef wrapper that matches the design you provided
const IconInput = React.forwardRef(
  (
    {
      icon = <MdEmail className="w-5 h-5" />,
      iconPosition = "right",
      iconClassName,
      containerClassName,
      showIcon = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center rounded-xl overflow-hidden border border-slate-300 bg-slate-50 ring-offset-background focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-all",
          containerClassName
        )}>
        {showIcon && iconPosition === "left" && (
          <div
            className={cn(
              "flex items-center justify-center px-4 bg-slate-100 text-slate-600 border-r border-slate-300",
              iconClassName
            )}>
            {icon}
          </div>
        )}

        <input
          className={cn(
            "flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-500 outline-none font-medium",
            className
          )}
          {...props}
        />

        {showIcon && iconPosition === "right" && (
          <div
            className={cn(
              "flex items-center justify-center px-4 py-3 text-slate-600 border-l border-slate-300",
              iconClassName
            )}>
            {icon}
          </div>
        )}
      </div>
    );
  }
);

IconInput.displayName = "IconInput";

export { IconInput };
