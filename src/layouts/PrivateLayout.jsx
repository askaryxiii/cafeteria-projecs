import Navbar from "./navbar/Navbar";

const PrivateLayout = ({ children }) => {
  return (
    <div className="auth-page flex flex-col items-center justify-center min-h-dvh gap-10 p-5">
      <div className="bg-[url('/assets/backgrounds/orderBG.png')] bg-no-repeat bg-top-right bg-light-grey flex flex-col gap-2 pr-0.5 md:pr-10 lg:pr-10 pl-0.5 md:pl-1 lg:pl-1 rounded-lg w-11/12 max-h-fit">
        <Navbar />
        <main className="grow">{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;
