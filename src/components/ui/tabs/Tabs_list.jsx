import { TabsTrigger } from "../../ui/tabs";

const CustTabList = ({ tab }) => {
  return (
    <TabsTrigger
      value={tab.value}
      className="
    bg-transparent
    text-dark-grey
    data-[state=active]:text-primary-navy
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
