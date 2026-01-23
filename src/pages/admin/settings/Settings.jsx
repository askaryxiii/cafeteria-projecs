import { Tabs, TabsList, TabsContent } from "../../../components/ui/tabs";
import DashboardHeader from "../../../layouts/navbar/admin/DashboardHeader";
import { IoSettingsSharp } from "react-icons/io5";
import CustTabList from "../../../components/ui/tabs/Tabs_list";
import WeeklyMenu from "../settings/WeeklyMenu";
import SettingsPanel from "../settings/SettingsPanel";

const Settings = () => {
  const tabs = [
    {
      title: "Weekly Menu",
      value: "weekly-menu",
    },
    {
      title: "Settings",
      value: "settings",
    },
  ];

  return (
    <main className="p-1 sm:p-1.5 md:p-2 bg-mid-grey rounded-md shadow-xl">
      <DashboardHeader
        title={"Settings"}
        icon={
          <IoSettingsSharp className="w-6 sm:w-7 md:w-7 h-6 sm:h-7 md:h-7 text-[#02356A]" />
        }
        dist="/"
      />
      <Tabs defaultValue="weekly-menu" className="w-full">
        <TabsList className="bg-transparent p-1 gap-3 w-full md:gap-4 border border-b-burned-grey border-t-burned-grey rounded-none ">
          {tabs.map((tab) => (
            <CustTabList key={tab.value} tab={tab} />
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-2 flex justify-center">
            {tab.value === "weekly-menu" ? <WeeklyMenu /> : <SettingsPanel />}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
};

export default Settings;
