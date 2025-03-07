import { useState } from "react";
import eyeSlash from "../../assets/images/eye-slash.png";
function ShowPassword({ passInput }) {
    const [render, setRender] = useState("password");
    const handleShowPassword = (e) => {
        if (passInput === null) {
            return;
        }
        if (passInput.type === "password") {
            passInput.type = "text";
            setRender("text");
        } else {
            passInput.type = "password";
            setRender("password");
        }
    };
    return (
        <>
            {render !== "password" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    onClick={handleShowPassword}
                    className="h-4 cursor-pointer shrink-0 w-6 aspect-square"
                >
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    <path
                        fillRule="evenodd"
                        d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    onClick={handleShowPassword}
                    className="h-4 cursor-pointer shrink-0 w-6 aspect-square"
                >
                    <path
                        fillRule="evenodd"
                        d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z"
                        clipRule="evenodd"
                    />
                    <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                </svg>
            )}
        </>
    );
}

export default ShowPassword;
