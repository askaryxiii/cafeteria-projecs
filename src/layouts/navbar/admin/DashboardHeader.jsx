import React from "react";
import { ImHome } from "react-icons/im";
import { Link } from "react-router-dom";

const DashboardHeader = ({ title, dist, icon }) => {
  return (
    <div className=" px-6 pt-7 pb-3 flex justify-between rounded-t-md items-center bg-mid-grey ">
      <div className="flex items-center gap-3">
        {icon}
        <h1 className="text-2xl font-semibold text-primary-navy"> {title} </h1>
      </div>
      <Link to={dist}>
        <ImHome className="w-7 h-7 p-0.5 text-primary-navy" />
      </Link>
    </div>
  );
};

export default DashboardHeader;
