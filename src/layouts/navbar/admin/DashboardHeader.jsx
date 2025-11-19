import React from "react";
import { ImHome } from "react-icons/im";
import { Link } from "react-router-dom";

const DashboardHeader = ({ title, dist, icon }) => {
  return (
    <div className=" px-6 py-7 flex justify-between items-center bg-[#E2E2E2] ">
      <div className="flex items-center gap-3">
        {icon}
        <h1 className="text-2xl font-semibold text-[#02356A]"> {title} </h1>
      </div>
      <Link to={dist}>
        <ImHome className="w-7 h-7 p-0.5 text-[#02356A]" />
      </Link>
    </div>
  );
};

export default DashboardHeader;
