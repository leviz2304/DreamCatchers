import * as React from "react";
import SocialIcon from "./SocialIcon";
import CategoryLink from "./CategoryLink";
import FooterColumn from "./FooterColumn";
import AppDownloadButton from "./AppDownloadButton";

import { useState } from "react";
export default function Footer() {
    const [isAdminPage, setIsAdminPage] = useState(false);

    React.useEffect(() => {
        if (window.location.pathname === "/admin") {
            setIsAdminPage(true);
        }
    });
    
const socialIcons = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/86855e3413a2ca60ba5eaf9af4a526332f8a2f1dca396da8c98b7eab16743e8e?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285", alt: "Social media icon 1" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/09c929af987190c9943e8a168ee1f6ed8fb6810ce18363679b8fe1380e1980b7?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285", alt: "Social media icon 2" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3bc0915462da2876e9047177a8aa92856faef9dbed74d017459132dd5bba9564?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285", alt: "Social media icon 3" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8560ce00cb740287241c28521c513505fb1a2c8e99da162c942733b50eb0177a?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285", alt: "Social media icon 4" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8d1d701ad138a75c7f6a1a15e0fffe01b095a3c24a99dfa6668274d31d3d7ac3?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285", alt: "Social media icon 5" }
  ];
  
  const categories = ["Development", "Finance & Accounting", "Design", "Business"];
  const quickLinks = ["About", "Become Instructor", "Contact", "Career"];
  const supportLinks = ["Help Center", "FAQs", "Terms & Condition", "Privacy Policy"];
    return (
        !isAdminPage && (
            <footer className="flex flex-col justify-center items-center bg-neutral-800 bg-black p-5 w-full">
            <div className="flex flex-wrap gap-6 items-start max-md:max-w-full">
              <div className="flex flex-col justify-center min-w-[240px] w-[424px] max-md:max-w-full">
                <div className="flex flex-col w-full text-justify max-w-[424px] max-md:max-w-full">
                  <div className="flex gap-2.5 items-start self-start text-4xl font-semibold tracking-tighter leading-none text-white whitespace-nowrap">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/400b7c79a483042a23f9f89c2309dc93eaed59d579cfd191779908816f4bb48d?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
                      alt="E-tutor logo"
                      className="object-contain shrink-0 aspect-square w-[46px]"
                    />
                    <div>Dream Catchers</div>
                  </div>
                  <div className="mt-5 text-sm tracking-normal leading-6 text-gray-400 max-md:max-w-full">
                    Aliquam rhoncus ligula est, non pulvinar elit
                    <br />
                    convallis nec. Donec mattis odio at.
                  </div>
                </div>
                <div className="flex gap-3 items-start self-start mt-7">
                  {socialIcons.map((icon, index) => (
                    <SocialIcon key={index} {...icon} />
                  ))}
                </div>
              </div>
      
              <FooterColumn title="Top 4 Category">
                {categories.map((category, index) => (
                  <CategoryLink key={index} text={category} />
                ))}
              </FooterColumn>
      
              <FooterColumn title="Quick Links">
                {quickLinks.map((link, index) => (
                  <CategoryLink key={index} text={link} />
                ))}
              </FooterColumn>
      
              <FooterColumn title="Support">
                {supportLinks.map((link, index) => (
                  <CategoryLink key={index} text={link} />
                ))}
              </FooterColumn>
      
             
            </div>
      
          
          </footer>
        )
    );
}
