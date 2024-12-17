import * as React from "react";

export default function CourseNavigation() {
  const navItems = [
    { id: "overview", label: "Overview", active: true },
    { id: "curriculum", label: "Curriculum", active: false },
    { id: "instructor", label: "Instructor", active: false },
    { id: "review", label: "Review", active: false }
  ];

  return (
    <div className="flex mt-10 w-full text-base font-medium leading-none text-center whitespace-nowrap max-w-[872px] max-md:max-w-full">
      <nav className="flex flex-auto mr-0 w-full max-md:max-w-full" role="navigation" aria-label="Course sections">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`gap-2.5 self-stretch pb-5 w-[200px] ${
              item.active ? 'bg-white shadow-sm text-neutral-800' : 'text-gray-600'
            }`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}