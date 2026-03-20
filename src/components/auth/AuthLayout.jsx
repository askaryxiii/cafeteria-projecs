import Logo from "../../components/ui/logos/Logo";

const AuthLayout = ({ title, sub, children }) => {
  return (
    <div className="auth-page">
      <div className="w-full max-w-6xl md:h-[575px] bg-[#E2E2E2] bg-cover bg-position-[22%_top] md:bg-top lg:bg-center bg-no-repeat rounded-lg overflow-hidden">
        {/* Logo Section */}
        <div className="">
          <Logo
            src={"/assets/logo/projecs.webp"}
            alt="projecs logo"
            className="h-auto w-64 md:w-80 px-3 py-1.5"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch md:items-center px-5 py-5 gap-0">
          {/* Left Side - Image (hidden on mobile) */}
          <div className="hidden md:col-span-2 lg:col-span-2 lg:flex items-center justify-center  ">
            <Logo
              src={"/assets/auth/main-art.png"}
              alt="auth illustration"
              width="680"
              className="lg:w-10/12 h-auto "
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-full lg:w-fit lg:col-span-1 lg:col-start-3 bg-[#001743] text-[#F9F9F9] p-5 shadow-xl rounded-4xl">
            {title && <div className="auth-title">{title}</div>}
            {sub && <div className="auth-sub">{sub}</div>}
            <div className="mt-4 sm:mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
