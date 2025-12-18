import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import DateRangeHeader from "../../components/user/orders/date-range-header";
import CalendarPicker from "../../components/user/orders/calendar-picker";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const DashboardAccountant = () => {
  const { user, logout } = useContext(AuthContext);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const navigate = useNavigate();
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
    },
    mode: "onChange",
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const onSubmit = (data, event) => {
    const action = event.nativeEvent.submitter.value;
    if (action === "users") {
      if (fromDate && toDate) {
        const dates = `${formatDateToDDMMYYYY(fromDate)}_${formatDateToDDMMYYYY(
          toDate
        )}`;

        // encode the dates segment to be safe in the URL
        navigate(`/accountant/users/${encodeURIComponent(dates)}`, {
          replace: true,
        });
      }
    }
    if (action === "ordersSummary") {
      if (fromDate && toDate) {
        const dates = `${formatDateToDDMMYYYY(fromDate)}_${formatDateToDDMMYYYY(
          toDate
        )}`;

        // encode the dates segment to be safe in the URL
        navigate(`/accountant/ordersSummary/${encodeURIComponent(dates)}`, {
          replace: true,
        });
      }
    }
  };

  const handleFromDateChange = (date) => {
    setValue("fromDate", date);
    setShowFromCalendar(false);
  };

  const handleToDateChange = (date) => {
    setValue("toDate", date);
    setShowToCalendar(false);
  };

  const formatDateToDDMMYYYY = (dateInput) => {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full sm:px-0 md:px-4 py-2 sm:py-3 md:py-4 max-w-full md:max-w-5xl mx-auto">
      <div>
        <DateRangeHeader
          title="users orders"
          fromDate={fromDate}
          toDate={toDate}
          onFromClick={() => setShowFromCalendar(!showFromCalendar)}
          onToClick={() => setShowToCalendar(!showToCalendar)}
        />

        {/* Calendars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 mb-2 w-full">
          <CalendarPicker
            className={"md:justify-self-start"}
            date={fromDate}
            onChange={handleFromDateChange}
            isOpen={showFromCalendar}
          />

          <CalendarPicker
            className={"md:justify-self-end md:col-start-2"}
            date={toDate}
            onChange={handleToDateChange}
            isOpen={showToCalendar}
          />
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        <button
          type="submit"
          name="action"
          value="users"
          className="uppercase w-full md:w-1/3 border-2 border-[#072A57] text-[#072A57] py-1.5 rounded-md hover:bg-[#072A57] hover:text-white cursor-pointer">
          Users
        </button>
        <button
          type="submit"
          name="action"
          value="ordersSummary"
          className="uppercase w-full md:w-1/3 border-2 border-[#072A57] text-[#072A57] py-1.5 rounded-md hover:bg-[#072A57] hover:text-white cursor-pointer">
          Order Summary
        </button>
      </div>
    </form>
  );
};

export default DashboardAccountant;
