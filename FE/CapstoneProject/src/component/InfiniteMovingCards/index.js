"use client";
"use client";

import { cn } from "../../utils/cn";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
  }) => {
    const containerRef = React.useRef(null);
    const scrollerRef = React.useRef(null);
  
    useEffect(() => {
      addAnimation();
    }, []);
  
    const [start, setStart] = useState(false);
  
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);
  
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });
  
        getDirection();
        getSpeed();
        setStart(true);
      }
    }
  
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    };
  
    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };
  
    return (
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item, idx) => (
            <li
              className="w-[150px] max-w-full relative rounded-xl border border-gray-300 text-center px-4 py-2 flex-shrink-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-rgb"
              key={item.name}
            >
              <span className="text-white text-sm font-semibold">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default InfiniteMovingCards;