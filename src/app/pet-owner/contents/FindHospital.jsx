"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import DialogViewHospital from "@/components/dialogs/DialogViewHospital";
import axios from "axios";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/bundle";
import {useFetchStates} from "@/utils/fetchStates";
import {useFetchUserState} from "@/utils/fetchUserState";

export const FindHospitalCard = ({
    id,
    name,
    states,
    address,
    profile_image,
}) => {
  const [openDialog, setOpenDialog] = useState(null);
  return (
    <div className="bg-[#EDF3FF] flex-1 rounded-2xl p-5 py-8 relative ">
      <DialogViewHospital
        open={openDialog === "view"}
        onClose={() => setOpenDialog(null)}
        hospitalId={id}
        hospitalImage={profile_image}
      />
      <button className="absolute top-5 right-5">
        <img
          src="/assets/icons/icon-arrow-top-right.svg"
          className="max-w-[12px] 2xl:max-w-[14px]"
        />
      </button>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center border-[8px] rounded-lg">
            <img src={profile_image} className="h-[95px] w-[95px] 2xl:w-[110px] 2xl:h-[110px] rounded-lg border-[#afbdd9]" />
        </div>
        <div className="mt-5 text-center min-h-[75px]">
          <b>{name}</b>
          <br />
          <small className="text-[#636363]">{states}</small>
            <br />
            <small className="text-[#636363]">{address}</small>
        </div>
        <button
          onClick={() => setOpenDialog("view")}
          className="w-full hover:!bg-[#243A8E] hover:!text-white bg-white font-bold text-xs 2xl:text-sm text-[#243a82] p-5 border border-[#ACACAC] rounded-[9px] !mt-6"
        >
          View Vets,Techs
        </button>
      </div>
    </div>
  );
};

const FindHospital = () => {
  const router = useRouter();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [addresses, setAddresses] = useState(['428 Olivia Road,Andrews, SC 29510']); // For the list of states from API
  const [hospitals, setHospitals] = useState([]);
  const {states} = useFetchStates();
  const { selectedState, setSelectedState } = useFetchUserState();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
            },
            (error) => {
                console.error("Error fetching location:", error);
                setUserLocation(null);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    const fetchHospitals = async () => {
        if (selectedState) {

            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/hospitals", {
                    params: {state: selectedState},
                });
                const hospitals = response.data.data;
                setHospitals(hospitals);

                const addressString = hospitals.map((hospital) => hospital.street_address || "");
                setAddresses(addressString);
            } catch (err) {
                console.log('Find hospital => ', err.message); // Handle API errors
            }
        }
        else setHospitals([]);

    };

    fetchHospitals();

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
          Find the Pet Hospital of Your choice
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
            className="2xl:text-[36px] text-[24px] lg:text-[32px] font-semibold leading-[1.4] lg:leading-[1.1] mt-10 mb-10"
          >
            Suggested Based on your location
          </h1>

        </div>
        <div>

          <Swiper
            className="flex gap-7 my-10"
            spaceBetween={24}
            slidesPerGroupAuto modules={[Navigation, Pagination, Scrollbar, A11y]}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onSlideChange={(swiper) =>
              setActiveIndex(Math.floor(swiper.activeIndex / 4))
            }
            navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }}
            scrollbar={{ draggable: true }}
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
              {hospitals.length > 0 ? (
                  hospitals.map((hospital, idx) => (
                      <SwiperSlide key={idx} className="hospital-card">
                          <FindHospitalCard id={hospital.id} name={hospital.name} states={hospital.states} address={hospital.street_address} profile_image={hospital.profile_img || "/assets/images/hospital.png"}/>
                      </SwiperSlide>
                  ))
              ) : (
                  <div>No hospitals found</div>
              )}
          </Swiper>
          {userLocation ? (
              <iframe
                  className="rounded-xl"
                  width="100%"
                  height="400px"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="map"
                  scrolling="yes"
                  src={`https://maps.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}&hl=en&z=14&output=embed`}
              ></iframe>
          ) : (
              <p>Loading map...</p>
          )}
          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push("/find-hospital")}
              className="bg-bgPrimaryGradientRed2 flex items-center transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-xl justify-center md:my-6 my-3 2xl:mt-10 p-8 py-5 2xl:p-8 2xl:py-6 w-fit text-white text-sm lg:text-sm 2xl:text-base font-bold rounded-lg"
            >
              See More{" "}
              <img
                src="/assets/icons/icon-arrow-right-big.svg"
                className="max-w-[24px] ml-2"
              />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FindHospital;
