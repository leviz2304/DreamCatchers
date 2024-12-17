import { cn } from "../../utils/cn";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};
export default BentoGrid;
