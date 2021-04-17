import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppType } from "../store";
import AppList from "../components/AppList";
const NonProductive = () => {
  const router = useRouter();
  const { updateAppType, nonProductive, phone, nonMark } = useAppType();

  return (
    <AppList
      phone={phone}
      tab="nonproductive"
      router={router}
      updateAppType={updateAppType}
      apps={[...nonProductive, ...nonMark]}
    />
  );
};

export default NonProductive;
