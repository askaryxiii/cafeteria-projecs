import Logo from "../../components/ui/logos/Logo";

const AuthLayout = ({ title, sub, children }) => {
  return (
    <div className="auth-page flex flex-col items-center justify-center min-h-screen gap-10 p-5">
      <div className="bg-white flex flex-col gap-6 px-10 py-7 rounded-lg  max-h-fit">
        <Logo src={"/assets/logo/projecs.webp"} alt="art" width="300" />
        <div className="flex gap-8 items-center">
          <div className="auth-left">
            <Logo src={"/assets/auth/main-art.png"} alt="art" width="700" />
          </div>
          <div className=" bg-[#001743] text-white p-8 rounded-3xl h-fit shadow-xl/20 ">
            {title && <div className="auth-title">{title}</div>}
            {sub && <div className="auth-sub">{sub}</div>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
