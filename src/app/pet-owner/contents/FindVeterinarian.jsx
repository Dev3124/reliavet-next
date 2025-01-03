"use client";

import { useEffect, useRef, useState } from "react";
import DialogViewVet from "@/components/dialogs/DialogViewVet";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useFetchStates } from "@/utils/fetchStates";
import { useFetchUserState } from "@/utils/fetchUserState";

import "swiper/css";
import "swiper/css/bundle";

export const FindVeterinarianCard = ({
  id,
  profileImage,
  name,
  role,
  rating,
  state,
  isAvailable,
  hospitalId,
  hospital,
  onButtonClick,
  buttonLabel = "Book Now",
  className = "",
  buttonClassName = "",
  imageClassName = "",
}) => {
  const [openDialog, setOpenDialog] = useState(null);

  const closeDialog = () => {
    setOpenDialog(null);
  };
  return (
    <div
      className={`bg-[#FFEDED] p-5 py-8 flex flex-col items-center rounded-[15px] relative ${className}`}
    >
      <DialogViewVet open={openDialog === "view"} onClose={closeDialog} doctorId={id} doctorImage={profileImage} doctorIsAvailable={isAvailable} hospitalId={hospitalId} hospitalName={hospital} rating={rating}/>

      <button className="absolute top-8 right-8">
        <img
          src="/assets/icons/icon-arrow-top-right.svg"
          className="max-w-[12px] 2xl:max-w-[14px]"
        />
      </button>
      <div className={`relative after:content-[''] after:absolute after:bottom-[8px] after:right-[12px] after:w-[17px] after:h-[17px] after:rounded-full ${
          isAvailable
              ? "after:bg-[#55CA74]" // Available: Green color
              : "after:bg-[#dbd6d6]" // Not available: Red color
      }`}>
        <img
          src={profileImage}
          alt="Profile"
          className={`h-[95px] w-[95px] 2xl:w-[105px] 2xl:h-[105px] object-cover rounded-full border-[8px] border-[#8E244B]/20 ${imageClassName}`}
        />
      </div>
      <h6 className="text-sm 2xl:text-base font-semibold">{name}</h6>
      <span className="text-xs 2xl:text-sm text-[#636363]">{role}</span>
      <div className="flex items-center my-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <img
            key={index}
            src="/assets/icons/icon-star-red.svg"
            className={index < rating ? "" : "opacity-40"}
            alt="Star"
          />
        ))}
      </div>
      <span className="text-xs 2xl:text-sm font-medium">
        State: <span className="text-[#636363]">{state}</span>
      </span>
      <span className="text-xs 2xl:text-sm font-medium block mt-1">
        Hospital:&nbsp;
        <span className="text-[#636363]">{hospital || 'Individual'}</span>
      </span>
      <button
        className={`w-full bg-white font-bold text-xs 2xl:text-sm text-[#DE1E33] hover:bg-[#DE1E33] hover:text-white p-5 border border-[#ACACAC] rounded-[9px] !mt-6 ${buttonClassName}`}
        onClick={() => setOpenDialog("view")}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

const FindVeterinarian = () => {
  const [doctors, setDoctors] = useState([]);
  const {states} = useFetchStates();
  const { selectedState, setSelectedState } = useFetchUserState();

  useEffect(() => {
    const fetchDoctors = async () => {
        if (selectedState) {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/doctors", {
                    params: {state: selectedState},
                });
                setDoctors(response.data.data);
            } catch (err) {
                console.log('Find veterinarian => ', err.message); // Handle API errors
            }
        }
        else setDoctors([]);
    };

    fetchDoctors();

  }, [selectedState]);

  const handleStateChange = async (e) => {
      const selected = e.target.value;
      setSelectedState(selected);
  };

  return (
    <section className="container px-10 mx-auto">
        <div>
        <div
          className="2xl:text-[55px] text-[32px] md:text-[36px] lg:text-[38px] xl:text-[42px] leading-[1.4] lg:leading-[1.1] font-semibold text-center my-20"
        >
          Find a Trusted Veterinarian Near You
        </div>
        <div className="flex flex-col my-5">
          <label
            htmlFor="search"
            className="pl-3 mb-2 flex gap-2 text-xs lg:text-sm text-[#636363]"
          >
            <Image
              alt="l"
              width={20}
              height={20}
              className=""
              src={"/assets/icons/icon-location.svg"}
            />
            Choose Location:
          </label>
          <select
              id="state-dropdown"
              value={selectedState}
              onChange={handleStateChange}
              className="rounded-3xl bg-[#ECEEF2] sm:w-[400px] px-6 lg:px-8 py-2 lg:py-3 focus:outline-none border border-[#C4C4C4] text-xs 2xl:text-sm"
          >
              <option value="">Select a State</option>
              {states.map((state) => (
                  <option key={state.id} value={state.code}>
                      {state.name}
                  </option>
              ))}
          </select>
        </div>
        <div>
          <h1
            className="2xl:text-[36px] text-[24px] lg:text-[32px] font-semibold leading-[1.4] lg:leading-[1.1] mt-10"
          >
            Suggested Based on your location
          </h1>

          <Swiper className="flex gap-7 mb-10 mt-5" spaceBetween={24} slidesPerGroupAuto modules={[Navigation, Pagination, Scrollbar, A11y]} navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
          }} scrollbar={{ draggable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
              {doctors.length > 0 ? (
                  doctors.map((doctor, idx) => (
                      <SwiperSlide key={idx}>
                          <FindVeterinarianCard
                              id={doctor.id}
                              profileImage={doctor.profile_img || "/assets/images/default_doctor.jpeg"}
                              name={doctor.name}
                              role={doctor.user_role}
                              rating={doctor.rate}
                              state={doctor.states}
                              isAvailable={doctor.is_available}
                              hospitalId={doctor.hospital_id}
                              hospital={doctor.hospital_name}
                              buttonLabel="Book an Appointment"
                          />
                      </SwiperSlide>
                  ))
              ) : (
                  <div>No veterinarians or technicians found</div>
              )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FindVeterinarian;
