import React from "react";
import { useRouter } from "next/router";
import { useAppType } from "../store";
import AppList from "../components/AppList";
const Productive = () => {
  const router = useRouter();
  const { updateAppType, productive, phone, nonMark } = useAppType();

  return (
    <AppList
      phone={phone}
      tab="productive"
      router={router}
      updateAppType={updateAppType}
      apps={[...productive, ...nonMark]}
    />
  );
};

export default Productive;
