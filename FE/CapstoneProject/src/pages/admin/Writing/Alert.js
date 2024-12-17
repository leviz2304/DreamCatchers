// src/components/Common/Alert.js

import React from "react";

export default function Alert({ type, message }) {
    const baseStyle = "px-4 py-2 rounded-md mb-4";
    const typeStyle = type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            {message}
        </div>
    );
}
