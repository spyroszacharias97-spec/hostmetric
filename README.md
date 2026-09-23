# HostMetric

HostMetric is the largest full-stack web application I have built to date.

I originally started the project as a website for a property management business. As development progressed, I kept moving functionality that would normally require separate tools, manual processes or direct database work into the application itself.

The result is much more than a public-facing website.

HostMetric combines a multilingual marketing website, a six-step property onboarding system, contact and client management, property administration, image management, a custom blog and SEO publishing system, and a direct-booking experience designed to integrate with Guesty.

I designed and developed the application end-to-end, from the public interface and custom animations to the database structure, server-side workflows, administration tools and third-party integrations.

One of the main goals throughout the project was simple: the person operating the website should not need to be a developer.

Property information can be managed through the administration area, enquiries and clients can be handled from the same system, property photographs can be uploaded and organized visually, SEO-ready articles can be created without editing source code, and the Guesty-powered direct-booking experience can be controlled from the admin interface.

---

## What the Project Includes

HostMetric brings together several systems that would normally exist as separate applications:

- Public multilingual property-management website
- Custom administration system
- Six-step property onboarding workflow
- Contact and enquiry management
- Client management
- Property and unit management
- Image upload and organization
- Guesty integration
- Direct-booking interface
- Availability and pricing search through Guesty
- Interactive property map
- Booking checkout and reservation flow
- Payment tokenization and payment flow through the Guesty booking integration
- Custom Content Studio
- Blog publishing
- SEO management
- Multilingual article management
- Responsive layouts
- Custom UI animations
- Structured database storage

The application was built as a complete full-stack system rather than a collection of static pages.

---

# Public Website

The public side of HostMetric was built from scratch with Next.js, React, TypeScript and Tailwind CSS.

It includes the main marketing pages and explains the company's property-management services, processes and approach in a structured, responsive interface.

The public experience includes:

- Homepage
- How It Works
- FAQ
- About
- Contact
- Get Started
- Blog
- Direct Booking
- Individual blog/article pages
- Multilingual navigation
- Responsive desktop, tablet and mobile layouts

The interface uses reusable React components rather than separate duplicated layouts for every page.

---

## Custom Frontend and Animations

A significant amount of the frontend was designed specifically for this project rather than assembled from a pre-built website template.

The interface includes custom visual and interactive elements such as:

- Animated wave backgrounds
- Moving graphical elements
- Circular icon animations
- Animated content sections
- Interactive cards
- Responsive navigation
- Dynamic language selection
- Custom forms
- Responsive grids and layouts
- Loading and state-based UI
- Interactive booking components
- Interactive map elements

The same design system is maintained across the public website, onboarding experience, booking flow and administration interface.

---

# Multilingual Architecture

HostMetric includes a custom internationalization system supporting **12 languages**.

Supported languages include:

- English
- Greek
- German
- French
- Italian
- Spanish
- Portuguese
- Bulgarian
- Serbian
- Turkish
- Russian
- Polish

Public interface text is managed through centralized JSON dictionaries rather than being duplicated directly inside individual pages.

The selected locale is preserved while users navigate through the application, and public routes can render the appropriate translated content dynamically.

This architecture is used across major areas of the website, including navigation, marketing pages, FAQ content, contact forms, onboarding and booking-related interfaces.

The administration interface remains intentionally manageable as an internal system while the public experience is localized for visitors.

---

# Contact and Enquiry System

The Contact page is connected to the application's backend rather than functioning as a simple email link.

Visitors can submit structured information including:

- Name
- Property country
- Property type
- Email
- Telephone number
- Property city or area
- Message
- Property photographs
- Consent information

Multiple property photographs can be attached directly to an enquiry.

The submitted information becomes part of the management workflow and can be reviewed from the administration interface.

The contact workflow also supports email notification, allowing a new enquiry to generate an email while keeping the structured request available inside the application.

---

## Contact Request Management

Administrators can view incoming contact requests through a dedicated management interface.

The system provides:

- Total request counts
- Answered requests
- Unanswered requests
- Request details
- Contact information
- Property information
- Attached photographs
- Message content
- Request dates
- Client association
- Answered/unanswered state management

Requests can therefore be handled as structured records rather than disappearing into an email inbox.

---

# Client Management

HostMetric includes a dedicated client-management area.

Administrators can search and manage clients and see their relationship with the onboarding process and properties.

The interface separates clients according to their progress, including clients who have completed the Get Started process and clients who have not yet completed it.

Client records can be connected with their properties and submitted information, creating a structured relationship between enquiries, clients, properties and onboarding data.

---

# Six-Step Property Onboarding System

One of the largest parts of the project is the **Get Started** workflow.

Instead of asking a property owner to send information manually through messages, spreadsheets or multiple emails, HostMetric provides a structured onboarding process spanning **six steps/pages**.

The form adapts to the type of property and collects detailed operational information required for short-term-rental management.

The onboarding process includes information such as:

### Owner and Business Information

- Account country
- Owner type
- Individual or company details
- Name
- Email
- Telephone / WhatsApp
- Country of residence
- Date of birth
- Residential address

### Property Information

- Property name
- Property type
- Country
- Region
- City
- Street address
- Postal code
- Property description
- Number of units

### Units and Property Characteristics

The system supports properties containing one or multiple units.

Detailed information can be stored for each unit, including accommodation characteristics and capacity-related information.

### Platforms and Existing Systems

The onboarding process can collect information about existing short-term-rental platforms and systems used by the property.

This includes listing/platform information relevant to services such as Airbnb and Booking.com.

### Property Operations

Operational information can also be collected, including:

- Check-in information
- Check-out information
- Reception details
- Guest access
- Cleaning arrangements
- Property rules
- Operational notes

### Policies

The system stores relevant accommodation policies and operational rules required for managing the property.

### Amenities and Accessibility

Property amenities can be selected and stored through structured fields.

The system supports a broad list of amenities and accessibility-related information instead of relying on a single free-text field.

### Pricing and Performance Information

Owners can provide existing pricing and performance-related information during onboarding.

This information is collected as part of the property's operational profile.

Performance concepts displayed elsewhere on the HostMetric website are informational; live property analytics and performance calculations are handled by the connected property-management platform rather than being presented as calculations performed by HostMetric itself.

### Listing Content

Existing listing information can be collected, including:

- Property descriptions
- Existing titles
- Listing content
- Notes
- Existing platform information

### Goals and Preferences

The onboarding process can also collect the owner's objectives and preferences so that the property-management team has more context than basic property specifications alone.

### Ownership and Authorization

The workflow includes ownership, confirmation and authorization information required during onboarding.

---

# Property Image Management

Image handling is integrated directly into the property workflow.

Owners can upload photographs during onboarding, and administrators can later manage those photographs through the administration system.

Images can be organized by property area or category.

The administration interface allows photographs to be:

- Uploaded
- Viewed
- Added
- Deleted
- Reorganized
- Moved between categories

This makes the image collection useful as structured property data rather than simply storing an unordered group of uploaded files.

---

# Property Management

HostMetric includes a dedicated administration area for properties.

Administrators can:

- Search properties
- View property information
- Open individual properties
- Review associated clients
- Review property type and location
- View unit counts
- Manage property status
- Activate properties
- Delete properties
- Work with the information collected during onboarding

Individual property records expose the much larger dataset collected through the Get Started workflow.

This creates a complete flow from public onboarding to structured administration.

---

# Administration System

The `/admin` area acts as the operational interface for the application.

It includes dedicated sections for:

- Dashboard
- Contact Requests
- Clients
- Get Started submissions
- Properties
- Guesty Properties
- Content Studio

The dashboard provides a quick overview of important application records and statuses.

Instead of requiring direct database access for normal content and property-management tasks, the application exposes these operations through visual management interfaces.

---

# Content Studio

One of the most substantial custom features in HostMetric is the built-in **Content Studio**.

It was designed so that an administrator can create a structured, SEO-ready article without needing to edit React components, HTML files or application source code.

An article can be created and managed directly from the administration interface.

---

## Structured Article Editing

The editor supports structured article content rather than only one large text field.

Article information can include:

- Article title
- Slug
- Category
- Excerpt
- Featured image
- Structured sections
- Section headings
- Paragraph content
- Internal links
- External links
- Calls to action
- Related articles

Sections can be organized independently, allowing long-form content to maintain a predictable structure.

---

## Featured Image Management

The Content Studio includes image handling for article content.

An administrator can select or upload the visual content required for an article without manually adding assets to the application's source code.

---

# Built-In SEO Management

SEO configuration is integrated directly into the article editor.

Instead of requiring a developer to modify metadata whenever an article is published, the administrator can manage the relevant information through the UI.

The SEO system includes fields and controls for information such as:

- SEO title
- Meta description
- Focus keyword
- Secondary keywords
- Search intent
- Snippet-related content
- Open Graph title
- Open Graph image
- Open Graph description
- Canonical information
- Indexing-related configuration

This allows the content workflow and SEO workflow to happen in the same place.

---

## Structured SEO and Search Engine Integration

The wider website architecture also includes search-engine-oriented functionality such as:

- Metadata management
- Canonical URL handling
- Hreflang/localized-page handling
- Sitemap support
- robots configuration
- Article structured data
- Breadcrumb structured data
- Internal linking
- Related article relationships
- Localized routes

The goal is for content published through the system to become part of the website's actual SEO architecture rather than simply appearing visually on a page.

---

# Multilingual Blog Publishing

The Content Studio also supports multilingual article workflows.

Article translations can be managed from the administration interface across the languages supported by the website.

This means the publishing workflow combines:

**content creation → structure → images → SEO → translations → publication**

inside the same application.

The administrator does not need to manually create a separate page component for every translated article.

This was one of the main reasons for building the Content Studio: publishing new content should be possible without being a programmer.

---

# Guesty Integration

HostMetric includes an integration layer for the Guesty Booking Engine API.

The objective is to keep Guesty as the source of truth for booking-related property information while HostMetric provides the public booking experience and management controls around it.

The connection uses Guesty credentials and allows synchronized Guesty properties to be represented inside HostMetric.

The Guesty administration area includes:

- Guesty connection state
- Property synchronization
- Synced-property status
- Direct Booking status
- Synchronization error information
- Per-property Direct Booking controls
- Global Book Now control

No fake/demo properties are required by the application architecture. Booking properties are intended to come from the Guesty integration.

---

# Direct Booking

HostMetric contains a dedicated public booking experience.

When Direct Booking is enabled, visitors can search the properties that have been synchronized from Guesty and enabled for direct booking.

The booking interface includes:

- Destination search
- Check-in date
- Check-out date
- Guest selection
- Adult/child/infant selection
- Available-property results
- Property information
- Property photographs
- Live Guesty availability
- Guesty pricing information
- Interactive map
- Property map markers
- Checkout flow
- Reservation flow
- Booking confirmation

The map uses real property coordinates when they are available from Guesty.

HostMetric therefore provides the customer-facing booking interface while Guesty remains the booking/property-management source for synchronized inventory, availability and pricing.

---

# Booking and Payment Architecture

The booking flow is implemented across both frontend and server-side routes.

The application contains functionality for:

- Guesty authentication
- Access-token handling
- Guesty API communication
- Property synchronization
- Availability/calendar requests
- Quotes
- Rate plans
- Reservation creation
- Reservation verification
- Reservation details
- Checkout
- Payment-provider handling
- Payment tokenization
- 3D Secure handling
- Booking confirmation

Payment details are handled through the Guesty booking/payment integration and tokenization flow rather than HostMetric storing raw card information itself.

The booking architecture was intentionally separated into dedicated modules and API routes so that the public interface does not contain the integration logic directly.

---

# Guesty Controls for Administrators

The booking feature can be controlled without editing code.

The administration interface provides a global Direct Booking / Book Now state as well as property-level controls.

This allows an administrator to determine which synchronized Guesty properties should be available through HostMetric's public booking experience.

The interface also exposes connection and synchronization state so that booking functionality is not treated as an invisible backend process.

---

# Database and Data Architecture

HostMetric uses structured database storage for the application's internal data.

The database supports relationships between areas such as:

- Contact requests
- Clients
- Properties
- Property units
- Onboarding information
- Images
- Content/blog information
- Guesty connection information
- Synchronized Guesty properties
- Booking configuration
- Booking sessions

The application was designed around structured records rather than storing important operational information only in emails or disconnected documents.

---

# Server-Side Functionality

HostMetric uses Next.js server-side functionality and API routes for operations that should not run entirely in the browser.

Server-side responsibilities include areas such as:

- Database access
- Form processing
- Data validation
- File/image workflows
- Contact processing
- Administration operations
- Content operations
- Guesty API communication
- Booking operations
- Reservation workflows

Sensitive integration logic and credentials are kept away from the public client-side interface.

---

# Architecture

The project follows a modular structure separating concerns such as:

- Public pages
- Administration pages
- Reusable React components
- API routes
- Database operations
- Guesty integration
- Booking logic
- Internationalization
- Content management
- SEO functionality
- Static assets
- Configuration
- Authentication and server-side logic

This became increasingly important as the project grew from a website into a much larger application.

Keeping these areas separated made it possible to continue adding functionality without placing the entire system inside a few oversized pages or components.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- MapLibre GL

## Backend and Data

- Next.js server-side functionality
- Next.js API routes
- Neon PostgreSQL
- Relational database architecture
- Server-side validation and processing
- File and image handling

## Integrations

- Guesty Booking Engine API
- Guesty payment/tokenization tooling
- Email delivery/notification integration
- MapLibre / OpenFreeMap-based mapping

## Development and Deployment

- Git
- GitHub
- npm
- ESLint
- Vercel

---

# Performance Metrics and Educational Content

HostMetric also contains educational content explaining important short-term-rental performance concepts.

Examples include:

`ADR = Rental Revenue / Occupied Nights`

`Occupancy Rate = Booked Nights / Available Nights × 100`

`RevPAN = Rental Revenue / Available Nights`

These sections explain how common property-management metrics work.

They should not be confused with the Guesty integration: live operational analytics and property-performance calculations are handled by Guesty, while HostMetric provides information about these concepts as part of its public content.

---

# Responsive Design

The application was designed for different screen sizes rather than only desktop use.

Layouts adapt across:

- Desktop
- Tablet
- Mobile

This applies to both the public website and major interactive workflows such as forms and booking.

---

# What I Learned Building HostMetric

HostMetric started much smaller than the application it eventually became.

Building it required me to work across frontend development, backend architecture, relational data, API integrations, file handling, internationalization, SEO, administration tooling and booking workflows within the same project.

One of the most valuable parts of the project was learning how quickly architecture matters once a website stops being just a collection of pages.

Adding features such as multilingual content, six-step onboarding, image management, Guesty synchronization and direct booking meant thinking about how data moves through the entire application:

**user interface → validation → server → database/external API → administration → public output**

It also pushed me to build tools for non-technical users rather than solving every task through source-code changes.

The Content Studio is a good example. Instead of manually creating and optimizing every blog article in code, I built an interface where content, images, SEO configuration and translations can be managed as data.

The same principle applies to property onboarding and Guesty Direct Booking: functionality that initially could have been handled manually became part of the application itself.

---

# Project Status

HostMetric is an actively developed personal software project and portfolio piece.

Some external functionality depends on third-party services and production credentials. In particular, live Guesty synchronization, availability, reservations and payment functionality require an appropriately configured Guesty environment.

The repository demonstrates the application architecture and implementation developed around those integrations.

---

# Live Application

https://hostmetric.gr

---

# About the Developer

**Spyros Zacharias**

I independently designed and developed HostMetric as a full-stack project, working across the frontend, backend, database, administration system, multilingual architecture, SEO tooling and third-party integrations.

The project represents my approach to building software around real workflows rather than isolated demo features.

---

## Repository

This repository contains the source code for the HostMetric web application.

---

© 2026 Spyros Zacharias. All rights reserved.