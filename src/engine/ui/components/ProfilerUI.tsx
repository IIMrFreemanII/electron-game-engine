import React, { useEffect, useState } from "react";
import { Profiler, ProfileResult } from "../../Profiler";
import { round } from "../../../utils";

import "./ProfileUI.css";

const useProfile = () => {
  const [data, setData] = useState<Record<string, number>>({});

  const handleUpdate = (result: ProfileResult) => {
    const { name, time } = result;
    setData((prev) => ({
      ...prev,
      [name]: time,
    }));
  };

  useEffect(() => {
    Profiler.addListener(handleUpdate);

    return () => Profiler.removeListener(handleUpdate);
  });

  return { data };
};

export const ProfilerUI = () => {
  const { data } = useProfile();

  return (
    <div className="container">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="element">{`${key}: ${round(value, 4)}ms`}</div>
      ))}
    </div>
  );
};
