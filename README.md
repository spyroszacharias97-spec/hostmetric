# HostMetric

**HostMetric is the largest full-stack project I have built so far.**

It started as a property-management website and gradually grew into a complete platform combining a multilingual public website, detailed property onboarding, administration tools, property and client management, a custom SEO/content system, and a Guesty-powered direct-booking experience.

I designed and developed the project end-to-end with one main goal: **the person operating the platform should be able to manage everyday work without touching the code or database.**

🌐 **Live Application:** https://hostmetric.gr

---

## What I Built

### Website & User Experience

- **Full-Stack Application** — Built from scratch with Next.js, React, TypeScript, PostgreSQL and server-side functionality.
- **Public Website** — Complete property-management website with dedicated marketing, service, FAQ, About, Contact, Get Started, Blog and Direct Booking experiences.
- **Responsive Design** — Public pages, forms, booking interfaces and administration tools adapt across desktop, tablet and mobile.
- **12 Languages** — Custom localization architecture supporting English, Greek, German, French, Italian, Spanish, Portuguese, Bulgarian, Polish, Serbian, Turkish and Russian.
- **Localized Routing** — Language selection is preserved across navigation with localized public routes and centralized translation dictionaries.
- **Custom UI & Animations** — Hand-built animated waves, moving graphical elements, circular icon animations, interactive sections, cards and transitions.
- **Reusable Components** — Shared React components and layouts keep the interface consistent instead of duplicating pages.

### Contact & Client Management

- **Structured Contact Form** — Visitors can submit contact details, property country/type/location, messages, consent information and multiple property photographs.
- **Email Notifications** — New enquiries can generate email notifications while the complete structured request remains stored in the platform.
- **Contact Request Admin** — Administrators can review requests, messages, property details, dates, contact information and submitted photographs.
- **Answered / Unanswered Workflow** — Contact requests can be tracked and managed according to their response status.
- **Client Management** — Administrators can search clients by details and view their onboarding progress and associated properties.
- **Client Records** — Enquiries, Get Started information and properties can be connected to the appropriate client.
- **Manual Client Creation** — New client records can also be created directly from the administration system.

### Property Onboarding

- **Multi-Step Get Started Workflow** — A detailed property onboarding process replaces spreadsheets, scattered messages and manual data collection.
- **Owner & Business Details** — Collects individual/company information, contact details, residence, address and ownership information.
- **Property Details** — Stores property name, type, country, region, city, address, postal code, description and other property information.
- **Multiple Units** — Supports detailed properties containing one or multiple accommodation units.
- **Unit Characteristics** — Accommodation information and capacity-related details can be stored individually for each unit.
- **Platform Information** — Collects relevant Airbnb, Booking.com and existing property-system/listing information.
- **Conditional Information** — Onboarding fields can adapt according to the property's existing platforms and submitted information.
- **Operations** — Collects check-in/out information, reception details, guest access, cleaning arrangements and operational notes.
- **Policies & Rules** — Property rules and accommodation policies are stored as structured information.
- **Amenities & Accessibility** — Detailed amenities and accessibility information can be selected instead of being stored in one generic text field.
- **Pricing & Performance Information** — Owners can provide existing pricing and performance-related information during onboarding.
- **Listing Content** — Existing titles, descriptions, platform content and listing information can be collected.
- **Goals & Preferences** — Owner objectives and management preferences become part of the property profile.
- **Ownership & Authorizations** — Confirmation, ownership and authorization information is included in the onboarding workflow.
- **Admin Editing** — Submitted onboarding/property information can later be reviewed and edited through the administration interface.

### Property & Image Management

- **Property Management** — Administrators can search, open and manage properties together with their clients, types, locations, units and statuses.
- **Property Statuses** — Properties can be organized by operational status and activated or managed directly through the admin.
- **Property Deletion** — Property records can be removed through the administration workflow when required.
- **Detailed Property Records** — The admin exposes the larger structured dataset collected during onboarding instead of only basic property information.
- **Photo Uploads** — Property photographs can be uploaded during enquiry/onboarding workflows and managed later.
- **Photo Categories** — Images can be organized according to property areas and room/category types.
- **Photo Management** — Administrators can view, upload, add and delete property photographs.
- **Photo Reorganization** — Administrators can change an image's category and move photographs between different property/room categories.

### Administration System

- **Custom Admin Area** — A dedicated management interface was built specifically for HostMetric rather than relying on direct database access.
- **Admin Dashboard** — Provides quick counts and status information for contacts, clients, Get Started submissions and properties.
- **Contact Requests** — Dedicated management area for incoming enquiries and their photographs/details.
- **Clients** — Dedicated client search, onboarding-status and property-management interface.
- **Get Started Submissions** — Completed and pending onboarding records can be reviewed and managed from the admin.
- **Properties** — Dedicated property administration with detailed records, units, status controls and client relationships.
- **Guesty Properties** — Separate administration interface for Guesty connection, synchronization and Direct Booking controls.
- **Content Studio** — Custom administration area for creating and managing website/blog content.
- **Protected Internal Workflows** — Administrative functionality is separated from the public-facing application.

### Content Studio & Blog

- **Custom CMS** — Blog content can be created and published without manually creating React pages or editing source files.
- **Structured Article Editor** — Articles support titles, slugs, categories, excerpts, headings, sections and structured content.
- **Featured Images** — Article imagery can be managed directly through the Content Studio.
- **Content Images** — Visual content can be incorporated into articles without manually adding it to page components.
- **Internal Links** — Articles can connect naturally to other HostMetric content.
- **External Links** — Relevant external resources can be managed as part of article content.
- **Related Articles** — Content can be connected with related guides/articles.
- **Calls to Action** — Structured article content can include relevant CTA sections.
- **Multilingual Articles** — Article translations can be managed across the website's supported languages.
- **Translation Workflow** — Content can be translated and managed without manually creating separate page components for every locale.

### SEO System

- **Built-In SEO Editor** — SEO information is managed from the Content Studio instead of requiring source-code changes.
- **SEO Titles & Meta Descriptions** — Search-result metadata can be configured for published content.
- **Focus & Secondary Keywords** — Keyword strategy can be stored directly with each article.
- **Search Intent** — Content strategy can include the intended search purpose of an article.
- **Open Graph** — Social-sharing title, description and image information can be configured.
- **Canonical URLs** — Canonical handling is part of the website's SEO architecture.
- **Hreflang** — Localized pages can expose language relationships for multilingual search engines.
- **Localized Routes** — Public content is available through language-aware URL structures.
- **Sitemap Support** — Published content can become part of the site's sitemap architecture.
- **Robots Configuration** — Search-engine crawling/indexing behavior is supported through the site's robots configuration.
- **Structured Data** — Article and breadcrumb schema form part of the site's structured SEO implementation.
- **SEO Publishing Workflow** — Content, images, links, metadata, translations and publication can be managed through one workflow.

### Guesty Integration

- **Guesty Booking Engine API** — HostMetric contains a dedicated integration layer for Guesty's booking infrastructure.
- **Guesty as Source of Truth** — Real booking inventory, availability and pricing come from Guesty rather than duplicated/mock HostMetric data.
- **Credential-Based Connection** — The administrator connects Guesty through the required integration credentials.
- **Automatic Property Sync** — Real Guesty listings can be synchronized into HostMetric instead of being recreated manually.
- **Synchronization Status** — The administration interface exposes connection/sync state and synchronization issues.
- **No Demo Booking Properties** — The booking architecture is designed around actual synchronized Guesty listings.
- **Per-Property Bookable Control** — Direct Booking can be enabled or disabled independently for synchronized properties.
- **Global Book Now Control** — The complete public booking experience can be enabled or disabled from the administration interface.

### Direct Booking

- **Public Booking Experience** — Visitors can search and book enabled Guesty properties directly through HostMetric.
- **Destination Search** — Guests can search according to their destination.
- **Check-In / Check-Out** — Date selection forms part of the Guesty availability search.
- **Guest Selection** — Booking search supports adults, children and infants.
- **Real Availability** — Search results are based on Guesty availability rather than hardcoded property data.
- **Guesty Pricing** — Pricing information comes through the Guesty booking flow.
- **Quotes & Rate Plans** — Guesty quote and rate-plan information is handled by the booking architecture.
- **Property Information & Photos** — Search/booking results can use synchronized property content and imagery.
- **Interactive Map** — Bookable properties can be displayed through MapLibre/OpenFreeMap.
- **Real Coordinates** — Map markers use Guesty property coordinates when available.
- **Booking Checkout** — HostMetric includes the customer-facing checkout and guest-details workflow.
- **Booking Sessions** — Booking state can be maintained through dedicated booking-session architecture.
- **Reservation Creation** — Reservations are created through the Guesty integration.
- **Reservation Verification** — The application contains server-side verification for the reservation/payment flow.
- **Reservation Details** — Reservation information can be retrieved for the customer-facing booking experience.
- **Booking Confirmation** — Successful bookings have a dedicated confirmation flow.

### Payments

- **Guesty Payment Architecture** — Booking payments are handled through the Guesty booking/payment integration.
- **Secure Tokenization** — Card details use Guesty-compatible tokenization rather than HostMetric storing raw card information.
- **3D Secure** — The booking architecture includes support for the required 3DS authentication flow.
- **Payment Provider Handling** — Provider-related payment logic is kept within the server-side booking architecture.
- **No Raw Card Storage** — HostMetric does not use its database as storage for customers' raw payment-card details.

### Backend & Data

- **Neon PostgreSQL** — Structured relational storage is used for HostMetric's internal application data.
- **Relational Architecture** — Contacts, clients, properties, units, onboarding information, images and other records are connected logically.
- **Guesty Integration Data** — Connection information, synchronized properties, booking configuration and booking sessions are represented separately.
- **Server-Side Processing** — Sensitive application operations run server-side rather than exposing integration logic in the browser.
- **API Routes** — Dedicated routes handle forms, administration operations, content, Guesty communication and booking workflows.
- **Validation** — Submitted information is processed and validated before being used by the application.
- **File & Image Workflows** — Uploads and image-related operations are integrated into the backend workflow.
- **Authentication** — Internal administration functionality is protected rather than being exposed as part of the public application.
- **Modular Architecture** — Public UI, admin, database logic, API routes, internationalization, SEO, Guesty and booking functionality are separated into dedicated areas.

### Performance Content

- **Performance Education** — HostMetric explains important short-term-rental concepts such as ADR, Occupancy and RevPAN.
- **Clear Responsibility** — These metrics are educational content inside HostMetric; live operational analytics and performance calculations remain handled by Guesty.

### Development & Deployment

- **Git & GitHub** — The complete project is version-controlled and maintained through Git.
- **Vercel Deployment** — The production application is deployed through Vercel.
- **Production Website** — The application is publicly available at **hostmetric.gr**.

---

## Tech Stack

**Frontend**  
Next.js · React · TypeScript · Tailwind CSS · Lucide React · MapLibre GL

**Backend & Data**  
Next.js Server-Side Functionality · API Routes · Neon PostgreSQL · Relational Data · File & Image Handling

**Integrations**  
Guesty Booking Engine API · Guesty Tokenization · Email Notifications · MapLibre / OpenFreeMap

**Development & Deployment**  
Git · GitHub · npm · ESLint · Vercel

---

## Why I Built It This Way

The part I value most about HostMetric is that these features are not isolated demos.

A visitor can send an enquiry, a property owner can complete onboarding and upload photographs, the information can become part of the client/property workflow, an administrator can edit the data and reorganize the photographs, content can be published and optimized without touching the source code, and synchronized Guesty properties can become part of a complete direct-booking flow.

Building HostMetric gave me hands-on experience across **UI/UX, frontend development, backend logic, relational databases, authentication, file handling, internationalization, SEO, CMS development, third-party APIs, booking systems, payment flows and production deployment**.

---

## Developer

### Spyros Zacharias

Designed and developed independently as a full-stack portfolio project.

**Live:** https://hostmetric.gr



© 2026 Spyros Zacharias. All rights reserved.