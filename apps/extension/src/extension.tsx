import { GalleryVerticalEnd, Link, Settings,X } from "lucide-react";
import { useState } from "react";
import { TitleIcon } from "../public";
import IconMenu from "../public/IconMenu";
import AllLinks from "./components/allLinks";
import Shortener from "./components/shortener";
import { LinkProps } from "./types";
import UserSpace from "./workspace/workspace";

interface ExtensionProps {
  handleClose: () => void;
}

const Extension: React.FC<ExtensionProps> = ({ handleClose }) => {
  const [openTab, setOpenTab] = useState<string>("create");
  const [allLinks, setAllLinks] = useState<LinkProps[]>([]);

  const handleAllFetchUrl = () => {
    console.log("get");
    setAllLinks([]);
  };

  return (
    <div className="w-100 mb-44 mr-10 rounded-lg bg-white  p-6 shadow-lg">
      <div className="flex flex-row justify-between">
        <TitleIcon />
        <p
          onClick={handleClose}
          className="cursor-pointer text-sm text-gray-800 transition-all duration-75 hover:scale-110 "
        >
          <IconMenu icon={<X />} />
        </p>
      </div>

      <div className="mt-3 flex gap-4">
        <button
          className="group rounded-full bg-gray-200 p-3 transition-all duration-75 hover:scale-110 hover:bg-blue-100 focus:outline-none active:scale-95"
          onClick={() => {
            setOpenTab("history");
            handleAllFetchUrl();
          }}
        >
          <IconMenu
            icon={
              <GalleryVerticalEnd className="h-4 w-4 text-gray-500 hover:text-black" />
            }
          />
        </button>
        <button
          className="group rounded-full bg-gray-200 p-3 transition-all duration-75 hover:scale-105 hover:bg-blue-100 focus:outline-none active:scale-95"
          onClick={() => setOpenTab("create")}
        >
          <IconMenu
            icon={<Link className="h-4 w-4 text-gray-500 hover:text-black" />}
          />
        </button>
      </div>
      {openTab === "create" && <Shortener />}
      {openTab === "history" && <AllLinks links={allLinks} />}

      <div className="flex justify-between items-center">
         <UserSpace/>
        <button className="group flex justify-center rounded-full bg-gray-100 p-2 transition-all duration-75 hover:scale-105 hover:bg-blue-100 focus:outline-none active:scale-95">
          <IconMenu
            icon={
              <Settings className="h-4 w-4 text-gray-500 hover:text-black" />
            }
          />
        </button>
      </div>
    </div>
  );
};

export default Extension;
