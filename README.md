# HostMetric

HostMetric is a full-stack web application built with Next.js and TypeScript for managing, processing and visualizing short-term rental data.

The project combines a modern multilingual frontend with structured data collection, database management, automated data processing and interactive management dashboards.

## Technical Overview

The application was designed as a complete web system rather than a static website.

It includes:

- Full-stack Next.js architecture
- TypeScript
- Responsive React interface
- Server-side functionality
- Database integration
- Structured relational data
- Automated data processing
- Management dashboards
- Dynamic forms
- File and image uploads
- Multilingual architecture
- Data-driven analytics
- Responsive desktop, tablet and mobile layouts

## Data Management

HostMetric stores and organizes information through structured database tables covering properties, reservations, clients, performance data and onboarding information.

The application is designed to process large amounts of structured data efficiently, allowing information from multiple properties and reservations to be analysed through the same system.

Data relationships make it possible to connect property information with reservations, dates, revenue and other operational metrics without relying on isolated spreadsheets or manual calculations.

## Automated Data Processing

A significant part of the application is designed around automation.

Instead of requiring every metric to be calculated manually, stored data can be processed automatically to generate updated performance information.

This includes calculations and analysis related to:

- Revenue
- Occupancy
- Average Daily Rate (ADR)
- RevPAR / RevPAN
- Booking pace
- Lead time
- Length of stay
- Availability
- Historical performance
- Property-level performance

The system separates raw stored data from calculated information, making the architecture easier to extend and maintain.

## Management Dashboards

Interactive dashboards provide a visual layer over the underlying database.

Large datasets are converted into structured tables, statistics and performance indicators so that information can be interpreted without manually examining individual database records.

The dashboard architecture brings together:

- Property data
- Reservation data
- Revenue information
- Occupancy
- Historical performance
- Booking behaviour
- Availability
- Performance indicators

## Forms and Data Collection

The application includes structured forms for collecting property and client information.

Submitted information is validated and stored so that it can become part of the application's data model rather than remaining as unstructured form submissions.

The onboarding system supports detailed property information and file/image uploads.

## Multilingual System

The application includes a custom multilingual architecture supporting 10 languages:

- English
- Greek
- German
- French
- Spanish
- Italian
- Portuguese
- Bulgarian
- Serbian
- Turkish

Translations are managed through centralized JSON dictionaries and loaded dynamically according to the selected locale.

The selected language is persisted so that navigation between pages maintains the user's language preference.

## Frontend Architecture

The interface is built using reusable React components rather than duplicated page structures.

Major UI sections are separated into independent components, including navigation, services, performance sections, platform visualization, property-growth elements, onboarding forms and footer content.

The application also includes custom animations, interactive elements, responsive layouts and dynamic visual components.

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend & Data

- Next.js server-side functionality
- API routes
- Database integration
- Structured relational tables
- Server-side data processing
- File and image storage

### Development

- Git
- GitHub
- npm
- ESLint
- Vercel

## Application Structure

The project follows a modular architecture separating:

- Pages and routes
- Reusable React components
- API functionality
- Internationalization
- Database operations
- Data processing
- Static assets
- Application configuration

This separation keeps the codebase easier to maintain as the amount of functionality and stored data increases.

## Performance and Analytics

The application processes property and reservation data to calculate and present several performance indicators, including:

`ADR = Rental Revenue / Occupied Nights`

`Occupancy Rate = Booked Nights / Available Nights × 100`

`RevPAN = Rental Revenue / Available Nights`

These calculations are generated from stored data and can be used across the management interface without requiring repeated manual calculations.

## Live Application

https://hostmetric.gr

## Repository

This repository contains the source code for the HostMetric web application.

The project was independently designed and developed using a full-stack, component-based architecture with an emphasis on structured data, automation, multilingual support and maintainability.

---

© 2026 HostMetric. All rights reserved.