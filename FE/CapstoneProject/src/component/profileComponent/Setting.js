    // src/pages/Settings.js
    import React from "react";

    const Settings = () => {
    return (
        <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
        <div className="grid grid-cols-3 gap-6">
            {/* Left: Profile Upload Section */}
            <div className="col-span-1 flex flex-col items-center">
            <div className="relative w-32 h-32">
                <img
                src="/profile-pic.jpg"
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
                />
                <button className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition">
                Upload Photo
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                Image size should be under 1MB and image ratio needs to be 1:1
            </p>
            </div>

            {/* Right: Form Section */}
            <div className="col-span-2">
            <form className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                <label className="block text-sm text-gray-700">First Name</label>
                <input
                    type="text"
                    placeholder="First name"
                    className="w-full border rounded-lg p-2 mt-1"
                />
                </div>
                <div>
                <label className="block text-sm text-gray-700">Last Name</label>
                <input
                    type="text"
                    placeholder="Last name"
                    className="w-full border rounded-lg p-2 mt-1"
                />
                </div>

                {/* Username */}
                <div className="col-span-2">
                <label className="block text-sm text-gray-700">Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full border rounded-lg p-2 mt-1"
                />
                </div>

                {/* Email */}
                <div className="col-span-2">
                <label className="block text-sm text-gray-700">Email</label>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full border rounded-lg p-2 mt-1"
                />
                </div>

                {/* Title */}
                <div className="col-span-2">
                <label className="block text-sm text-gray-700">Title</label>
                <input
                    type="text"
                    placeholder="Your title, profession or small biography"
                    className="w-full border rounded-lg p-2 mt-1"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">0/50</p>
                </div>

                {/* Save Changes Button */}
                <div className="col-span-2">
                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white rounded-lg p-2 mt-4"
                >
                    Save Changes
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
    };

    export default Settings;
