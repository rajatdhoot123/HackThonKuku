import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppType } from "../store";
import axios from "axios";
import { secondsToHms } from "../utils/helper";
import { useUser } from "../context/usercontext";
import firebase from "../firebase";

const ShowApps = ({ selectTab, tab }) => (
  <>
    <h1 className="font-semibold text-2xl my-5 w-3/4">
      Set productive and unproductive app
    </h1>
    <div className="flex justify-between items-center">
      <button
        onClick={() => {
          selectTab("productive");
        }}
        className={`${
          tab === "productive"
            ? "font-semibold text-theme bg-theme bg-opacity-10 py-3 px-5 rounded-3xl"
            : ""
        } text-center text-lg focus:outline-none w-1/2`}
      >
        Productive
      </button>
      <button
        onClick={() => {
          selectTab("unproductive");
        }}
        className={`${
          tab === "unproductive"
            ? "font-semibold text-theme bg-theme bg-opacity-10 py-3 px-5 rounded-3xl"
            : ""
        } text-center text-lg focus:outline-none w-1/2`}
      >
        UnProductive
      </button>
    </div>
  </>
);

const AppsSelections = ({ data = [], phone }) => {
  const [tab, selectTab] = useState("productive");
  const [editVisible, setEditVisible] = useState(false);
  const { updateAppType, productive, nonProductive, nonMark } = useAppType();
  const router = useRouter();

  useEffect(() => {
    updateAppType(data[0].apps, phone);
  }, [data]);

  return (
    <div className="p-5">
      {!editVisible ? (
        <>
          <ShowApps tab={tab} selectTab={selectTab} />
          <div className="my-5">
            {(tab === "productive" ? productive : nonProductive).map((app) => (
              <div key={app.id} className="flex items-center py-2">
                <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
                <h1 className="ml-2">{app.title}</h1>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AppList
          updateAppType={updateAppType}
          phone={phone}
          setEditVisible={setEditVisible}
          tab={tab}
          apps={
            tab === "productive"
              ? [...productive, ...nonMark]
              : [...nonProductive, ...nonMark]
          }
        />
      )}
      {!editVisible ? (
        <div className="w-full my-5">
          <button
            onClick={() => {
              router.push({
                pathname: `${tab}`,
              });
            }}
            className="m-auto flex justify-center bg-blue-300 bg-opacity-50 px-5 py-3 text-blue-500 rounded-2xl"
          >
            Add / Edit
          </button>
        </div>
      ) : null}
    </div>
  );
};

const DropDown = ({ options, onSelect, initalValue }) => {
  const [selected, setSelected] = useState(initalValue);

  useEffect(() => {
    onSelect(selected === "" ? "" : +selected);
  }, [selected]);
  return (
    <div className="relative inline-flex">
      <svg
        className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 412 232"
      >
        <path
          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
          fill="#648299"
          fillRule="nonzero"
        />
      </svg>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
        }}
        className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
      >
        {initalValue === "" && (
          <option key="No Option" value="" id="">
            Select
          </option>
        )}
        {options.map(({ fullname, id }) => (
          <option key={id} value={id}>
            {fullname}
          </option>
        ))}
      </select>
    </div>
  );
};

const AppTable = ({ apps, user, phone }) => {
  const [data, setData] = useState(apps);
  const [maximumProductive, setMaxProductive] = useState("");
  const [activeFilter, setActiveFilter] = useState({
    type: "",
    direction: true,
  });
  useEffect(() => {
    setData(apps);
  }, [apps]);

  useEffect(() => {
    if (activeFilter.type) {
      handleFilter(activeFilter.type, activeFilter.direction);
    }
  }, [activeFilter]);

  const handleFilter = (type, dir) => {
    setData(() => [
      ...data.sort((a, b) => (dir ? a[type] - b[type] : b[type] - a[type])),
    ]);
  };

  const updateProductiveHours = async (e) => {
    if (e.target.value) {
      try {
        const { data } = await axios.post(
          "https://api.ratrey.co/v1.0/parssal/mark-apps-non-productive/",
          {
            non_productive_usage: e.target.value,
            phone,
          }
        );
        console.log({ data });
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div className="border-red-500 border m-2 p-2 rounded-lg bg-red-100">
      <div className="text-center text-lg font-semibold flex justify-between">
        <div>{user.fullname}</div>
        <div>
          <div>Allow Non Productive Hours</div>
          <div>
            <input
              onBlur={updateProductiveHours}
              onChange={(e) => setMaxProductive(e.target.value)}
              value={maximumProductive}
            />
          </div>
        </div>
      </div>
      <table className="table-fixed">
        <thead>
          <tr>
            <th
              onClick={() => {
                setActiveFilter({
                  type: "title",
                  direction: !activeFilter.direction,
                });
              }}
              className="w-1/2 text-left"
            >
              App Name
            </th>
            {/* <th
              onClick={() => {
                setActiveFilter({
                  type: "usage",
                  direction: !activeFilter.direction,
                });
              }}
              className="w-1/4 text-left"
            >
              Usage
            </th> */}
            <th className="w-1/4 text-center">Productive/Non Productive</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ title, usage, id }) => (
            <tr key={id}>
              <td>{title}</td>
              {/* <td>{secondsToHms(usage)}</td> */}
              <td className="text-center">
                <DropDown
                  initalValue=""
                  onSelect={async (e) => {
                    if (e !== "") {
                      try {
                        const { data } = await axios.post(
                          "https://api.ratrey.co/v1.0/parssal/mark-apps-non-productive/",
                          {
                            non_productive_usage: e,
                            phone,
                          }
                        );
                        console.log({ data });
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  }}
                  options={[
                    { fullname: "Productive", id: 0 },
                    { fullname: "Non Productive", id: 1 },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NotLogin = ({ onGmailLogin, user, logOut }) => {
  return (
    <div className="h-screen w-full flex  items-center justify-center">
      {!user.uid ? (
        <button
          className="bg-red-400 text-white px-5 py-3 rounded-lg font-bold"
          onClick={onGmailLogin}
        >
          Login
        </button>
      ) : (
        <button
          className="bg-red-400 text-white px-5 py-3 rounded-lg font-bold"
          onClick={logOut}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default function Home({ error, devices, ...props }) {
  // const { user = {}, setLogin, loginState, onGmailLogin, logOut } = useUser();

  // if (user === null) {
  //   return <div>Loading...</div>;
  // }
  // console.log(props, user, error);

  // if (user.error || error.status_code === 401) {
  //   return <NotLogin user={user} onGmailLogin={onGmailLogin} logOut={logOut} />;
  // }

  const [activeProfile, setActiveProfile] = useState(1);
  const router = useRouter();
  const [number, setNumber] = useState();

  useEffect(() => {
    if (router.query.phone) {
      setNumber(router.query.phone);
    }
  }, [router.query]);

  const phone = router.query.phone;
  if (!phone) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-1/4">
          <p className="text-center my-2">Enter Number</p>
          <input
            maxLength="10"
            type="text"
            className="w-full border-red-400 border-2 rounded-lg
          border-opacity-30"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <button
            onClick={() => {
              router.push(`/?phone=${encodeURIComponent(`+91${number}`)}`);
            }}
            className="text-center my-2 w-full"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppsSelections
      phone={phone}
      data={devices.filter((device) => +device.user.id === +activeProfile)}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center">
        <h1 className="mx-2 font-semibold">Select Profile</h1>
        <DropDown
          initalValue={devices.map((device) => device.user)[0].id}
          onSelect={(profile) => setActiveProfile(profile)}
          options={devices.map((device) => device.user)}
        />
      </div>
      <div className="grid w-full grid-cols-1 ">
        {devices
          .filter((device) => +device.user.id === +activeProfile)
          .map((device) => (
            <AppTable phone={phone} key={device.user.id} {...device} />
          ))}
      </div>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps = async ({ query: { phone = "" } }) => {
  try {
    // const { data: user } = await axios.get(
    //   `https://api.ratrey.co/v1.0/parssal/me/`
    // );
    const { data } = await axios.get(
      `https://api.ratrey.co/v1.0/parssal/app-list/?phone=${encodeURIComponent(
        phone
      )}`
    );

    return { props: data };
  } catch (e) {
    return {
      props: {
        error: e.response.data,
      },
    };
  }
};
