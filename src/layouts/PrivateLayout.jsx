import Navbar from "./navbar/Navbar";

const PrivateLayout = ({ children }) => {
  return (
    <div className="auth-page flex flex-col items-center justify-center h-screen gap-10 p-5">
      <div className="bg-[#ececec] flex flex-col gap-2 px-2.5 md:px-10 lg:px-10 py-7 rounded-lg w-11/12 max-h-fit">
        <Navbar />
        <main className="grow">{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;
