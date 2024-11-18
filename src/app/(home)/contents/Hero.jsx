"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const router = useRouter();

  const titleRef = useRef(null);
  const tabRefs = useRef([]);
  const imgRef = useRef(null);
  const h4Ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Scale-in animation for the title
    gsap.fromTo(
      titleRef.current,
      { scale: 0 },
      { scale: 1, duration: 1, ease: "power4.out", delay: 0.2 }
    );

    // Scale-in animation for each tab
    gsap.fromTo(
      tabRefs.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 1,
      }
    );

    // Scale-in animation for himg4
    gsap.fromTo(
      imgRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power4.out", delay: 1.5 }
    );

    // Scale-in animation for h4
    gsap.fromTo(
      h4Ref.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power4.out", delay: 2 }
    );

    // Scale-in animation for button
    gsap.fromTo(
      buttonRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power4.out", delay: 2.5 }
    );
  }, []);

  return (
    <section className="bg-[#ECEDF0] lg:h-[90vh] overflow-hidden">
      <div className="container flex flex-col items-center mx-auto pt-8 2xl:pt-12 justify-between h-full">
        <div className="flex flex-col items-center p-5 lg:p-10">
          <h1
            ref={titleRef}
            className="font-bold leading-[1.4] lg:leading-[1.1] text-[30px] lg:text-[54px] 2xl:text-[68px] text-center"
          >
            Your Trusted Partner in Pet Care <br className="hidden lg:block" />
            Tailored Solutions for Every Role
          </h1>

          <ul className="grid grid-cols-2 sm:flex items-center gap-6 mt-6">
            {[
              { link: "pet-owner", name: "Pet Owner" },
              { link: "veterinarian", name: "Veterinarian" },
              { link: "technician", name: "Technician" },
              { link: "hospital", name: "Hospital" },
            ].map((tabName, index) => (
              <li
                ref={(el) => (tabRefs.current[index] = el)}
                key={tabName.name}
                onClick={() => router.push(`/${tabName.link}`)}
                className={` text-[8px] lg:text-[13px] 2xl:text-[15px] font-bold cursor-pointer border-b-2 relative w-fit px-6 py-3 hover:before:content-[""] hover:before:w-full hover:before:h-[1.5px] hover:before:bg-[linear-gradient(89.98deg,#D8003E_0.02%,#3F8EFF_99.98%)] hover:before:absolute hover:before:left-0 hover:before:bottom-0 hover:after:content-[""] hover:after:w-full hover:after:h-[5px] hover:after:bg-[linear-gradient(89.98deg,#D8003E_0.02%,#3F8EFF_99.98%)] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:blur-[10px]`}
              >
                {tabName.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 relative after:absolute after:content-[''] after:w-[800px] after:h-[800px] after:rounded-full after:bg-primary after:blur-[300px] after:top-[calc(100%-18rem)] after:left-[-10rem]  after:opacity-70 after:z-[1]">
          <img
            ref={imgRef}
            src="/assets/images/hero_section_1.png"
            className="w-full max-w-[350px] 2xl:max-w-[400px] relative z-[2]"
          />
          <div className="w-full flex text-center flex-col items-center lg:items-end max-w-[500px] relative z-[2] px-5 lg:px-0">
            <h4
              ref={h4Ref}
              className="font-bold text-[20px] lg:text-[26px] 2xl:text-[32px] text-center lg:text-right"
            >
              Find the Best Care for Your Pet <br className="hidden lg:block" />{" "}
              with Trusted Veterinarians
            </h4>
            <button
              ref={buttonRef}
              className="bg-bgPrimaryGradientRed p-4 px-8 lg:p-4 lg:py-6 2xl:p-6 2xl:py-8 w-fit lg:w-full text-white lg:max-w-[200px] 2xl:max-w-[250px] text-[10px] lg:text-sm 2xl:text-sm font-bold rounded-lg mt-8"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
