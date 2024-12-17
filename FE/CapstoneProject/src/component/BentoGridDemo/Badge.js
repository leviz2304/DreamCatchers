const Badge = ({ keyData, children }) => {
    return (
      <div
        key={keyData}
        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold uppercase inline-block mr-2 transition-all duration-300 ease-in-out group-hover:translate-y-1 group-hover:bg-orange-200 group-hover:shadow-md hover:scale-110"
      >
        {children}
      </div>
    );
  };
  
  export default Badge;
  