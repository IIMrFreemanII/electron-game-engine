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
            list.push(<div className="element">{`${key}: ${value}`}</div>)
        })

        return list;
    };

    return (
        <div className="container">{renderList()}</div>
    );
};