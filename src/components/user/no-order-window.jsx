import { BiTimeFive } from "react-icons/bi";

const NoOrderWindow = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 min-h-96">
      <div className="flex flex-col items-center gap-6 md:gap-8 text-center">
        <img
          src="/assets/logo/closed.gif"
          alt="Closed"
          className="w-4/5 md:w-full h-64 md:h-64 object-contain"
        />

        <div className="space-y-5">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-navy">
            Lunch Order is not available for this week.
          </h2>
          <p className="text-lg md:text-xl text-dark-grey font-normal">
            We will be back soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoOrderWindow;
