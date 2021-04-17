import create from "zustand";

function updateApps(apps) {
  return apps.reduce(
    (acc, current) => {
      switch (current.app_type) {
        case 0:
          return {
            ...acc,
            nonMark: [...acc.nonMark, current],
          };
        case 1:
          return {
            ...acc,
            productive: [...acc.productive, current],
          };
        case 2:
          return {
            ...acc,
            nonProductive: [...acc.nonProductive, current],
          };
        default:
          return acc;
      }
    },
    {
      nonProductive: [],
      productive: [],
      nonMark: [],
    }
  );
}

export const useAppType = create((set) => ({
  productive: [],
  nonProductive: [],
  nonMark: [],
  phonne: "",
  updateAppType: (apps, phone) => set({ ...updateApps(apps), phone }),
}));
