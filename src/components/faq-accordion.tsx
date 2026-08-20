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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={`${item.question}-${index}`}
            className={`overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
              isOpen
                ? "border-blue-200 shadow-[0_18px_50px_rgba(33,102,243,0.10)]"
                : "border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-8 md:py-7"
            >
              <span className="text-lg font-bold leading-7 text-[#111827] md:text-xl">
                {item.question}
              </span>

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 bg-[#2166f3] text-white"
                    : "bg-blue-50 text-[#2166f3]"
                }`}
                aria-hidden="true"
              >
                <span className="text-2xl font-light leading-none">
                  {isOpen ? "−" : "+"}
                </span>
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-slate-100 px-6 pb-7 pt-5 md:px-8 md:pb-8">
                  <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}