import React, { useEffect, useState } from "react";
import { Profiler, ProfileResult } from "../../Profiler";
import './ProfileUI.css';

export const ProfilerUI = () => {
    const [update, setUpdate] = useState(false);

    const handleUpdate = (result: ProfileResult) => {
        // console.log(result);
        setUpdate((prev) => !prev);
    }

    useEffect(() => {
        Profiler.addListener(handleUpdate);

        return () => Profiler.removeListener(handleUpdate);
    });

    const renderList = () => {
        const list: React.ReactElement[] = [];

        Profiler.data.forEach((value, key) => {
            list.push(<div key={key} className="element">{`${key}: ${value.toFixed(4)}ms`}</div>)
        })

        return list;
    };

    return (
        <div className="container">{renderList()}</div>
    );
};