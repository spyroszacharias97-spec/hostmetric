"use client";

import { useState } from "react";


export type FAQItem = {
  question: string;
  answer: string;
};


type FAQAccordionProps = {
  items: FAQItem[];
};


export default function FAQAccordion({
  items,
}: FAQAccordionProps) {

  const [openIndex, setOpenIndex] =
    useState<number | null>(null);


  const toggleItem = (
    index: number
  ) => {
    setOpenIndex(
      (current) =>
        current === index
          ? null
          : index
    );
  };


  return (
    <div
      className="
        space-y-3
        sm:space-y-4
      "
    >

      {items.map(
        (item, index) => {

          const isOpen =
            openIndex === index;


          return (
            <div
              key={`${item.question}-${index}`}
              className={`
                overflow-hidden
                rounded-[18px]
                border
                bg-white
                transition-all
                duration-300
                sm:rounded-[22px]
                md:rounded-[24px]
                ${
                  isOpen
                    ? "border-blue-200 shadow-[0_18px_50px_rgba(33,102,243,0.10)]"
                    : "border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md"
                }
              `}
            >

              {/* ==========================================
                  QUESTION
              ========================================== */}

              <button
                type="button"
                onClick={() =>
                  toggleItem(index)
                }
                aria-expanded={isOpen}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  px-4
                  py-4
                  text-left
                  sm:gap-4
                  sm:px-5
                  sm:py-5
                  md:gap-6
                  md:px-8
                  md:py-7
                "
              >

                <span
                  className="
                    min-w-0
                    flex-1
                    break-words
                    text-base
                    font-bold
                    leading-6
                    text-[#111827]
                    sm:text-lg
                    sm:leading-7
                    md:text-xl
                  "
                >
                  {item.question}
                </span>


                <span
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-300
                    sm:h-10
                    sm:w-10
                    ${
                      isOpen
                        ? "rotate-180 bg-[#2166f3] text-white"
                        : "bg-blue-50 text-[#2166f3]"
                    }
                  `}
                  aria-hidden="true"
                >

                  <span
                    className="
                      text-xl
                      font-light
                      leading-none
                      sm:text-2xl
                    "
                  >
                    {isOpen
                      ? "−"
                      : "+"}
                  </span>

                </span>

              </button>


              {/* ==========================================
                  ANSWER
              ========================================== */}

              <div
                className={`
                  grid
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >

                <div className="overflow-hidden">

                  <div
                    className="
                      border-t
                      border-slate-100
                      px-4
                      pb-5
                      pt-4
                      sm:px-5
                      sm:pb-6
                      sm:pt-5
                      md:px-8
                      md:pb-8
                    "
                  >

                    <p
                      className="
                        max-w-4xl
                        break-words
                        text-sm
                        leading-7
                        text-slate-600
                        sm:text-base
                        sm:leading-8
                        md:text-lg
                      "
                    >
                      {item.answer}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}
