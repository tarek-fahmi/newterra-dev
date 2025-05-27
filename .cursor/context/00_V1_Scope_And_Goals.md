NewTerra V1 - Scope and Goals
Version: 1.0
Last Updated: 2025-05-16

**1. Project Overview**

    NewTerra is a comprehensive SaaS platform designed to streamline farm administration and financial operations for Australian agricultural businesses. Version 1 (V1) focuses on creating a solid foundation with core functionality for secure user registration (Profile Sign-Up) and a comprehensive Onboarding workflow via this web application. The primary goal of V1 is to enable initial client data capture and establish the data handoff process to our operations team for manual backend service fulfillment.

**2. Primary Goals for V1**

- Implement onboarding functionality (second stage of sign-up).
  - Provide input feilds for all text data.
  - Provide document upload portals for required documents.
  - After onboarding is complete, upload these files to sharepoint through the API.
    - Indicate that onboarding is pending review.
    - Indicate that onboarding has been successful (Onboarding success page)

# Business Onboarding Page:

    Develop a multi-step, user-friendly "wizard secure online form process" within the app for businesses to register their farm details after account creation.

    Collect Comprehensive Client Information: The onboarding process will gather detailed information across several categories. Storing this in our Supabase backend provides control and a central reference. The key categories include:

## Client Basic Information Subpage/Header:

- Full Business Name (as registered with ABN/ASIC),
- Trading Name,
- ABN,
- ACN (if applicable),
- GST Registered status,
- Main Contact Person (name, title),
- Contact Email(s) (Accounts, Admin, Personal),
- Contact Phone Number(s),
- Postal Address, Property Address(es),
- Business Structure.`

## Farm-Specific Information Subpage/Header: (This data is optional).

    - Main Farming Activities (e.g., orange cultivation),
    - Names of Key Staff,
    - Licenses Held (e.g., chemical permits, machinery licenses, food safety certs),
    - Chemical and Fertiliser Usage details (),
    - Livestock Numbers (approximate, for potential future mixed farming),
    - Types of Crops (primarily oranges, note varieties),
    - Water Licences/Access.

## Financial & Bookkeeping Details Subpage/Header: 

    - Current Bookkeeping Software,
    - Access to Bookkeeping Software,
    - Bank Feeds Set Up status (in current system),
    - Accountant’s & BAS Agent’s details,
    - BAS Lodgement Frequency,
    - Payroll Processing needs (Yes/No, number of employees, software used, access if required).

## Administration and Compliance Subpage/Header: 

    - Vehicle/Equipment list with Rego Renewal Dates,
    - Insurance Policies (Public Liability, Vehicle, Workers Comp, Crop/Livestock) with Renewal Dates (and policy numbers/providers?),
    - Licence Expiry Dates (Chemical Handling, Heavy Vehicle, Quad Bike, Water Licences),
    - Key Contract Expiry Dates (Land/Equipment leases, Agistment, Sales contracts), Suppliers List.

**Document & File Access (for VA migration):**

    - Details of current Cloud Storage (Google Drive, Dropbox, etc.),
    - Permissions Granted for VA access,
    - Filing System Preference (to understand current setup for migration).

**Service Agreement & Consent:**

    - Confirmation of Signed Service Agreement (Digital signature in-app?),
    - Privacy Consent Form (for data use, future benchmarking),
    - Direct Debit Authority (if applicable),
    - Acceptance of Terms and Conditions (in-app tick box).

**Communication Preferences:**

    - Preferred Communication Method (Email, Phone, SMS, WhatsApp – Note: MVP comms outside app),
    - Preferred Contact Times,
    - Reporting Frequency preferences (e.g., Weekly Admin Summary, Fortnightly Bookkeeping Update, Monthly Financial Reports - Contents to be defined by service offering).

Support document upload capability during the onboarding process for necessary initial documents (e.g., proof of business, key licenses if required at this stage).

Implement progress saving for the multi-step onboarding form, allowing users to save their progress and resume later.

# Key Considerations

**Core Data Integration & Handoff:**

    Establish a reliable connection and data flow to Supabase as the primary backend for storing user profiles and all collected onboarding data.

    Create secure API endpoints (Supabase Edge Functions) for all frontend-to-backend data transmission.

    Implement the data handoff process: Onboarding data and any uploaded documents are securely pushed to a designated, structured area in SharePoint for the operations team to access and begin manual service fulfillment.

**1. Out of Scope for V1**

    Farmer-Facing Dashboard: (User dashboard views for financial summaries, task status, etc., will be handled via direct VA communication for V1).

    Advanced Analytics & Reporting: (Beyond basic operational counts for the internal team if an Admin Hub is built).

    Payment Processing Integration: (No subscription billing in V1).

    Dedicated Native Mobile Application (Phone App):

    Direct Third-Party Service Integrations from the Farmer App (beyond Supabase): For V1, the Farmer App primarily talks to Supabase.

    Automated Xero Data Entry/Population by the System: While data is collected for Xero, the V1 system will hand off data for manual Xero setup by VAs. (n8n automation for Xero pre-filling is a potential V1.1 or V2).

    Full VA Portal within NewTerra: (VA task management will occur in an external platform like Monday.com for V1).

    Complex n8n Workflow Automations: (Beyond potentially simple SharePoint folder creation or notification workflows if deemed essential for V1 ops handoff).

**1. Success Metrics for V1**

    User Registration: Achieve a sign-up and email verification success rate of 90% or higher for users attempting to register.

    Onboarding Completion: Target a business onboarding form completion rate of 75% or higher for users who start the process.

    Data Handoff Integrity: Ensure onboarding data and associated documents are successfully and accurately transmitted to the designated SharePoint location with 99.9% accuracy (to be verified by initial manual checks by the ops team).

    Initial User Feedback (SumarFarms & Early Testers): Collect qualitative feedback and aim for an average UI/UX satisfaction score of 4/5 or higher on the onboarding process.

    Operational Readiness: The operations team can successfully access and utilize the data from SharePoint to perform their manual client setup tasks.

**5. Timeline (for this V1 Scope)**

    Development: 8 weeks (focused on the features defined in this V1 scope).

    Internal Testing & UAT (with SumarFarms): 2 weeks.

    Deployment and Initial Launch with Trial Partners: 2 weeks (includes buffer and initial support).

**1. Technical Requirements (Core for V1)**

    Frontend: React with TypeScript (prototyped with Tempo, developed in Cursor).

    Styling: Tailwind CSS (potentially with shadcn/ui components).

    Backend & Authentication: Supabase (PostgreSQL, Supabase Auth, Supabase Edge Functions).

    Document Handoff: Integration with Microsoft SharePoint.

    Security: Implementation of secure authentication, secure API endpoints, and protection of sensitive data.

    Design: Responsive design for desktop and tablet. Mobile web access should be functional but secondary optimization for V1.

    Version Control: Git (repository hosted on GitHub/GitLab/Bitbucket).

    Deployment: Defined CI/CD process for frontend (e.g., Vercel/Netlify) and Supabase functions.
