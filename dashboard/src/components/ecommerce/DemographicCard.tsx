import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import CountryMap from "./CountryMap";
import React from "react";

export default function DemographicCard() {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { label: "View More", value: "view_more" },
    { label: "Delete", value: "delete" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customers based on country
          </p>
        </div>
        <div className="relative inline-block">
          <Dropdown
            value={selectedOption}
            options={options}
            onChange={(e) => setSelectedOption(e.value)}
            placeholder="Select an option"
            className="w-40 p-2"
          />
          <i className=" pi-ellipsis-v absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer" />
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap mapColor={undefined} />
        </div>
      </div>
    </div>
  );
}
