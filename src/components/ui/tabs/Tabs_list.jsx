import { TabsTrigger } from "../../ui/tabs";

const CustTabList = ({ tab }) => {
  return (
    <TabsTrigger
      value={tab.value}
      className="
    bg-transparent
    text-[#8A919A]
    data-[state=active]:text-[#011844B2]
    transition-none!  
    rounded-none
    px-0
    py-1 sm:py-2
    font-base
    text-xs sm:text-sm md:text-base
    whitespace-nowrap
  ">
      {tab.title}
    </TabsTrigger>
  );
};

export default CustTabList;
