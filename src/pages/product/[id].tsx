import Image from "next/image";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoStarOutline } from "react-icons/io5";

import ProductDetail from "@/components/molecules/ProductDetail";
import ProductCarousel from "@/components/molecules/ProductCarousel";
import ProductBidder from "@/components/molecules/ProductBidder";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "@/components/molecules/Loader";
import { getProductByID } from "@/hooks/query/getSingleProduct";
import { useSelectedUser } from "@/hooks/state/useAppState";
import { toast } from "react-toastify";
import { useBid } from "@/hooks/mutation/usePlaceBid";

const index = () => {
  const [user] = useSelectedUser();
  const router = useRouter();
  const productId = router.query.id;
  const [showOverview, setShow] = useState(true);
  const [bidAmount, setBid] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: proposeBid, isLoading: isBidLoading } = useBid();

  const placeBid = () => {
    if (user.name === "") {
      toast.error("Please login to place bid");
      return;
    }
    if (bidAmount <= data.maxBid) {
      toast.error("Please enter amount greater than max bid");
      return;
    }
    const bidData = {
      amount: parseInt(bidAmount),
      productId: data._id,
    };
    proposeBid(bidData, {
      onSuccess: () => {
        toast.success("Bid Placed Successfully");
        setIsOpen(false);
        window.location.reload();
      },
      onError: () => {
        toast.error("Error in placing bid");
      },
    });
    console.log("placing Biddddddd...........");
  };

  const { data, isLoading } = getProductByID((productId as string) || "");

  if (isLoading) {
    return <Loader />;
  }
  const formatDuration = (timeDifferenceMs: number) => {
    const days = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifferenceMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifferenceMs / (1000 * 60)) % 60);
    const second = Math.floor((timeDifferenceMs / 1000) % 60);

    let formattedTimeDifference = `${days
      .toString()
      .padStart(2, "0")}d : ${hours.toString().padStart(2, "0")}h : ${minutes
      .toString()
      .padStart(2, "0")}m`;
    if (days === 0) {
      formattedTimeDifference =
        formattedTimeDifference.slice(6) +
        " : " +
        second.toString().padStart(2, "0") +
        "s";
    }

    return formattedTimeDifference;
  };

  const getTime = () => {
    const now = new Date(Date.now());
    const start = new Date(data.starting);
    const end = new Date(data.ending);
    const result = end.getTime() - now.getTime();
    console.log("result", result);
    const remainingTime = formatDuration(result);

    if (data.status === "Active") {
      return (
        <>
          <p className="text-sm sm:text-lg">Time left</p>
          <p className="text-xl lg:text-4xl md:text-2xl font-baibold">
            {remainingTime}
          </p>
        </>
      );
    } else if (data.status === "Pending") {
      return (
        <div>
          <p className="text-sm sm:text-lg">Starting on</p>
          <div className="text-xl lg:text-4xl md:text-2xl font-baibold">
            <p> {formatDuration(start.getTime() - now.getTime())}</p>
          </div>
        </div>
      );
    } else if (data.status === "Expired") {
      return (
        <div>
          <p className="text-sm text-red-600 sm:text-lg">Expired on</p>
          <div className="text-xl lg:text-3xl md:text-2xl font-baibold">
            <p> {end.toDateString()}</p>
            <p>{end.toTimeString().slice(0, 8)}</p>
            {/* <p> {formatDuration(end)</p> */}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-sm sm:text-lg">Status</p>
          <p
            className={`text-lg lg:text-2xl md:text-xl font-baibold ${
              data.status === "Completed"
                ? "text-[#0B6623]"
                : data.status === "Expired"
                ? "text-red-600"
                : ""
            }`}
          >
            {data.status}
          </p>
        </div>
      );
    }

    // // if (now.getTime() > end.getTime()) {
    // //   return (
    // //     <div>
    // //       <p className="text-sm sm:text-lg">Status</p>
    // //       <p
    // //         className={`text-lg lg:text-2xl md:text-xl font-baibold ${
    // //           data.status === "Completed"
    // //             ? "text-[#0B6623]"
    // //             : data.status === "Expired"
    // //             ? "text-red-600"
    // //             : ""
    // //         }`}
    // //       >
    // //         {data.status}
    // //       </p>
    // //     </div>
    // //   );
    // // }
    // // if (now.getTime() < start.getTime()) {
    // //   return (
    // //     <div>
    // //       <p className="text-sm sm:text-lg">Start on</p>
    // //       <div className="text-xl lg:text-4xl md:text-2xl font-baibold">
    // //         <p> {formatDuration(start.getTime() - now.getTime())}</p>
    // //       </div>
    // //     </div>
    // //   );
    // // }

    // // return remainingTime;
    // return (
    //   <>
    //     <p className="text-sm sm:text-lg">Times left</p>
    //     <p className="text-xl lg:text-4xl md:text-2xl font-baibold">
    //       {remainingTime}
    //     </p>
    //   </>
    // );
  };

  if (!data || !data) {
    return <div>Nothing to see</div>;
  }
  return (
    <div className="min-h-screen mt-32 ">
      <div className="">
        <ProductCarousel data={data?.images} />
      </div>
      <div className="flex flex-col justify-start pb-8 mx-auto mt-8 sm:flex-row sm:w-full ">
        <div className="w-full">
          <div className="flex gap-2 p-4 my-4 lg:gap-8 md:gap-4">
            <p
              onClick={() => setShow(true)}
              className="p-1 transition-colors duration-500 ease-in-out border-2 cursor-pointer md:p-3 border-black-600 hover:bg-black-100 hover:text-white font-baiMedium"
            >
              Oveview
            </p>
            <p
              onClick={() => setShow(false)}
              className="p-1 transition-colors duration-500 ease-in-out border-2 cursor-pointer md:p-3 border-black-600 hover:bg-black-100 hover:text-white font-baiMedium"
            >
              Bidding
            </p>
            {data.status === "Active" ? (
              <p
                onClick={() => setIsOpen(true)}
                className="p-1 transition-colors duration-500 ease-in-out border-2 cursor-pointer md:p-3 border-black-600 hover:bg-black-100 hover:text-white font-baiMedium"
              >
                Place Bid
              </p>
            ) : (
              <p className="p-1 transition-colors duration-500 ease-in-out border-2 cursor-pointer md:p-3 border-black-600 hover:bg-black-100 hover:text-white font-baiMedium">
                {" "}
                {data.status === "Pending" ? "Not Started" : "Auction End"}
              </p>
            )}
          </div>
          {showOverview && !isOpen ? (
            <ProductDetail data={data} />
          ) : (
            <ProductBidder product={data} />
          )}
          {isOpen && (
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              className="relative z-50 p-16 bg-black-100 text-black-600"
            >
              <div
                className="fixed inset-0 bg-black-900/30"
                aria-hidden="true"
              />

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 ">
                  <Dialog.Panel className="w-full max-w-sm p-4 mx-auto bg-white rounded h-1/4">
                    <Dialog.Title className="text-lg sm:text-xl font-baibold">
                      <div className="flex items-center justify-between mx-2">
                        <p>Place your bid</p>
                        <p>{data.maxBid} bids</p>
                      </div>
                    </Dialog.Title>
                    <div className="p-1 mt-6 font-baiMedium ">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <p>Your max bid : </p>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBid(e.target.value)}
                            className="flex-1 border-b-2 outline-none border-black-600 placeholder:text-sm"
                            placeholder="Enter your maximum bid "
                          />
                        </div>

                        <Button
                          variant="secondary"
                          fullWidth
                          className="px-3 py-1 my-2 rounded-md shadow-md py0 hover:ring-0 disabled:bg-gray-400 disabled:hover:ring-0"
                          onClick={placeBid}
                          disabled={isBidLoading}
                        >
                          Place Bid
                        </Button>
                      </div>
                      <div className="text-gray-600 font-baiMedium">
                        <p className="my-1 text-sm text-center ">
                          Bid should be more than current bid
                        </p>
                        <p className="mt-8">Sales tax : 7.50%</p>
                        <p>GST(Goods and Services Tax) : 10%</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-4 my-4 text-center text-red-600 rounded-md cursor-pointer bg-stone-100 hover:bg-stone-200 active:bg-red-700 active:text-white">
                        <IoStarOutline size={20} className="" />
                        <span className="text-center ">Add To Watch List</span>
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          )}
        </div>

        <div className="flex flex-row flex-wrap w-11/12 gap-4 mx-auto mt-6 mr-4 sm:mx-0 sm:gap-8 sm:flex-col sm:mt-28 sm:w-2/5">
          <div className="flex-1 p-4 mx-0 sm:flex-initial sm:mx-4 rounded-xl bg-stone-100 shadow-3xl whitespace-nowrap">
            {getTime()}
          </div>

          <div className="flex-1 p-4 mx-0 sm:flex-initial sm:mx-4 rounded-xl bg-stone-100 shadow-3xl">
            <p className="text-sm sm:text-lg">Current Bid</p>
            <p className="text-xl lg:text-4xl md:text-2xl font-baibold">
              ${data.maxBid}
            </p>
          </div>

          <Link
            href={`/profile/${data.createdBy._id}`}
            className="flex items-center justify-between p-1 mx-0 transition-all duration-500 ease-in-out shadow-xl sm:mx-4 rounded-xl bg-stone-100 hover:shadow-3xl"
          >
            <div className="flex items-center pr-12 text-base sm:gap-2 sm:text-lg font-bai">
              <Image
                src={`/images/profile/p1.png`}
                width={80}
                height={80}
                alt=""
              ></Image>
              <p>{data.createdBy.firstname}</p>
            </div>
            <AiOutlineArrowRight size={30} className="hidden sm:block" />
          </Link>
          {data.status === "Completed" && (
            <Link href={`/profile/${data.bidwinner._id}`}>
              <div className="flex-1 p-4 mx-4 sm:flex-initial rounded-xl bg-stone-100 shadow-3xl">
                <p className="text-sm sm:text-lg">Winner</p>
                <p className="flex justify-between text-xl lg:text-4xl md:text-2xl font-baibold">
                  {data.bidwinner.firstname}
                  <AiOutlineArrowRight size={30} className="hidden sm:block" />
                </p>
              </div>
            </Link>
          )}
          {data.status === "Expired" && (
            <div className="flex-1 p-4 mx-4 sm:flex-initial rounded-xl bg-stone-100 shadow-3xl">
              <p className="text-xl md:text-2xl font-baibold">
                Bid ended without a winner{" "}
              </p>
              <p className="py-3 text-sm sm:text-lg">Contact the owner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
