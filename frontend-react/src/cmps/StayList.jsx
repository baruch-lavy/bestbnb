import React from "react";
import { useSelector } from "react-redux";
import { StayPreview } from "./StayPreview.jsx";

export function StayList() {
    const stays = useSelector((state) => state.stayModule.stays); // ✅ Get stays from Redux
    console.log("🚀 StayList received stays:", stays); // ✅ Debugging log

    if (!stays?.length) {
        return (
            <div className="no-stays-message">
                <h2>No stays found</h2>
                <p>Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <ul className="stay-list">
            {stays.map((stay) => (
                <li key={stay._id}>
                    <StayPreview stay={stay} />
                </li>
            ))}
        </ul>
    );
}
