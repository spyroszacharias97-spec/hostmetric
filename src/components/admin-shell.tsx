"use client";


import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  signOut,
} from "next-auth/react";


import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  ClipboardList,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";


import type {
  AdminDictionary,
} from "@/i18n/admin";



type AdminShellProps = {
  children:
    React.ReactNode;

  dictionary:
    AdminDictionary;
};



export default function AdminShell({
  children,
  dictionary,
}: AdminShellProps) {

  const pathname =
    usePathname();


  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);


  const navigation = [
    {
      label:
        dictionary.navigation
          .dashboard,

      href:
        "/admin",

      icon:
        LayoutDashboard,
    },

    {
      label:
        dictionary.navigation
          .contactRequests,

      href:
        "/admin/contact-requests",

      icon:
        MessageSquareText,
    },

    {
      label:
        dictionary.navigation
          .leads,

      href:
        "/admin/leads",

      icon:
        Users,
    },

    {
      label:
        dictionary.navigation
          .getStarted,

      href:
        "/admin/get-started",

      icon:
        ClipboardList,
    },

    {
      label:
        dictionary.navigation
          .properties,

      href:
        "/admin/properties",

      icon:
        Building2,
    },
  ];


  const handleLogout =
    async () => {

      await signOut({
        callbackUrl:
          "/admin/login",
      });

    };


  /* =========================================================
     RESPONSIVE ADMIN SHELL
     Mobile adjustments only. Navigation, auth, routing and
     dictionary logic remain unchanged.
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-slate-50
        text-slate-900
      "
    >

      {/* MOBILE TOP BAR */}
      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-14 sm:h-16
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4 sm:px-5
          lg:hidden
        "
      >

        <Link
          href="/admin"
          className="
            text-xl
            font-black
            tracking-tight
          "
        >
          HostMetric

          <span
            className="
              text-blue-600
            "
          >
            {" "}
            Admin
          </span>
        </Link>


        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (open) =>
                !open
            )
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            transition
            hover:bg-slate-50
          "
          aria-label={
            mobileOpen
              ? dictionary.common
                  .closeMenu
              : dictionary.common
                  .openMenu
          }
        >
          {
            mobileOpen
              ? (
                <X
                  size={22}
                />
              )
              : (
                <Menu
                  size={22}
                />
              )
          }
        </button>

      </header>



      {/* MOBILE OVERLAY */}
      {
        mobileOpen && (
          <button
            type="button"
            aria-label={
              dictionary.common
                .closeMenu
            }
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="
              fixed
              inset-0
              z-40
              bg-slate-950/30
              backdrop-blur-sm
              lg:hidden
            "
          />
        )
      }



      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50

          flex
          w-[270px]
          max-w-[88vw]
          flex-col
          overflow-y-auto
          sm:w-[285px]

          border-r
          border-slate-200
          bg-white

          transition-transform
          duration-300

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* BRAND */}
        <div
          className="
            flex
            h-[88px] lg:h-[96px]
            items-center
            border-b
            border-slate-100
            px-5 sm:px-7
          "
        >

          <Link
            href="/admin"
            className="
              text-2xl
              font-black
              tracking-tight
            "
          >
            HostMetric

            <span
              className="
                block
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-blue-600
              "
            >
              {
                dictionary.common
                  .adminConsole
              }
            </span>
          </Link>

        </div>



        {/* NAVIGATION */}
        <nav
          className="
            flex-1
            px-3 sm:px-4
            py-5 sm:py-6
          "
        >

          <p
            className="
              px-3
              text-[11px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-slate-400
            "
          >
            {
              dictionary.navigation
                .management
            }
          </p>


          <div
            className="
              mt-3
              space-y-1.5
            "
          >

            {
              navigation.map(
                (item) => {

                  const Icon =
                    item.icon;


                  const active =
                    pathname ===
                      item.href ||
                    (
                      item.href !==
                        "/admin" &&
                      pathname.startsWith(
                        `${item.href}/`
                      )
                    );


                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={`
                        flex
                        items-center
                        gap-3

                        rounded-xl
                        px-3
                        py-2.5
                        sm:px-3.5
                        sm:py-3

                        text-sm
                        font-semibold

                        transition

                        ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }
                      `}
                    >

                      <Icon
                        size={19}
                        className={
                          active
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />


                      {
                        item.label
                      }

                    </Link>
                  );

                }
              )
            }

          </div>

        </nav>



        {/* SIDEBAR BOTTOM */}
        <div
          className="
            border-t
            border-slate-100
            p-4
          "
        >

          <div
            className="
              rounded-2xl
              bg-slate-50
              p-3 sm:p-4
            "
          >

            <p
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              HostMetric
            </p>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {
                dictionary.common
                  .internalManagementSystem
              }
            </p>

          </div>


          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              mt-3
              flex
              w-full
              items-center
              gap-3

              rounded-xl
              px-3.5
              py-3

              text-sm
              font-semibold
              text-slate-600

              transition

              hover:bg-red-50
              hover:text-red-600
            "
          >

            <LogOut
              size={18}
            />


            {
              dictionary.navigation
                .logout
            }

          </button>

        </div>

      </aside>



      {/* MAIN AREA */}
      <div
        className="
          min-w-0
          lg:pl-[285px]
        "
      >

        {/* DESKTOP TOPBAR */}
        <header
          className="
            hidden
            h-[88px] lg:h-[96px]
            items-center
            justify-between

            border-b
            border-slate-200
            bg-white

            px-8

            lg:flex
            xl:px-10
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-slate-500
              "
            >
              {
                dictionary.common
                  .administration
              }
            </p>


            <p
              className="
                mt-1
                text-lg
                font-bold
                text-slate-900
              "
            >
              {
                dictionary.common
                  .managementSystem
              }
            </p>

          </div>



          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                text-right
              "
            >

              <p
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                {
                  dictionary.common
                    .administrator
                }
              </p>


              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                {
                  dictionary.common
                    .hostMetricTeam
                }
              </p>

            </div>


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-blue-600
                font-bold
                text-white
                shadow-sm
              "
            >
              H
            </div>

          </div>

        </header>



        {/* PAGE CONTENT */}
        <main
          className="
            min-h-[calc(100vh-96px)]
            p-4
            sm:p-6
            lg:p-8
            xl:p-10
          "
        >

          <div
            className="
              mx-auto
              max-w-[1500px] min-w-0
            "
          >
            {
              children
            }
          </div>

        </main>

      </div>

    </div>
  );
}
