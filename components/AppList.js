import { useState, useEffect } from "react";
import axios from "axios";

const AppList = ({ apps = [], tab, updateAppType, router, phone }) => {
  const [localApps, setLocalApps] = useState(apps);
  useEffect(() => {
    setLocalApps(apps);
  }, [apps]);

  const postData = async (localApps) => {
    try {
      const { data } = await axios.post(
        "https://api.ratrey.co/v1.0/parssal/mark-apps/",
        {
          apps: localApps,
          phone,
        }
      );
      console.log(data);
      updateAppType(data.apps);
      router.back();
    } catch (e) {
      console.log(e);
    }
  };

  const handleAppType = ({ id }) => {
    const newData = localApps.map((el) => {
      if (el.id == id) {
        return Object.assign({}, el, {
          app_type: el.app_type !== 0 ? 0 : tab === "productive" ? 1 : 2,
        });
      }
      return el;
    });
    setLocalApps(newData);
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 h-full" style={{overflow: "scroll"}}>
        {localApps.map((app) => (
          <div className="flex my-2 items-center justify-between" key={app.id}>
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
              <h1 className="ml-2">{app.title}</h1>
            </div>
            <button
              onClick={() => {
                handleAppType({
                  id: app.id,
                  type: app.app_type === 0 ? true : false,
                });
              }}
              className={`${
                app.app_type === 0 ? "bg-gray-300" : "bg-theme"
              }  p-1 rounded w-6 h-6`}
            >
              <img src="/check.svg" />
            </button>
          </div>
        ))}
      </div>
      <div className="w-full my-5 flex">
        <button
          onClick={() => {
            router.back();
          }}
          className="w-1/2 mx-2 m-auto flex justify-center bg-gray-300 bg-opacity-50 px-5 py-3 rounded-2xl"
        >
          Close
        </button>
        <button
          onClick={() => {
            postData(localApps);
          }}
          className="w-1/2 mx-2 m-auto flex justify-center bg-theme px-5 py-3 text-white rounded-2xl"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AppList;
