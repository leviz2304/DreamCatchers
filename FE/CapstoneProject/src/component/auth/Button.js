import { useMemo } from "react";

const Button = ({
    heroiconsOutlinedevicePho,
    inputFieldPassword,
    propAlignSelf,
    propFlex,
    className,
    link,
}) => {
    const buttonStyle = useMemo(() => {
        return {
            alignSelf: propAlignSelf,
            flex: propFlex,

        };
    }, [propAlignSelf, propFlex]);

    return (
        <a
        href={link}
        className={`w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 ${className}`}
    >
        <img
            className="w-6 h-6"
            alt="Button Icon"
            src={heroiconsOutlinedevicePho}
        />
    </a>
    );
};
export default Button;