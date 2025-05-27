// Auto-generated types from Supabase
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            addresses: {
                Row: {
                    address_type: string
                    business_profile_id: string
                    country: string
                    id: string
                    is_primary: boolean
                    line1: string
                    line2: string | null
                    postcode: string
                    state: string
                    suburb: string
                }
                Insert: {
                    address_type: string
                    business_profile_id: string
                    country?: string
                    id?: string
                    is_primary?: boolean
                    line1: string
                    line2?: string | null
                    postcode: string
                    state: string
                    suburb: string
                }
                Update: {
                    address_type?: string
                    business_profile_id?: string
                    country?: string
                    id?: string
                    is_primary?: boolean
                    line1?: string
                    line2?: string | null
                    postcode?: string
                    state?: string
                    suburb?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "addresses_business_profile_id_fkey"
                        columns: ["business_profile_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            business_onboarding_sections: {
                Row: {
                    business_profile_id: string
                    data: Json
                    section_name: Database["public"]["Enums"]["onboarding_section"]
                    updated_at: string
                }
                Insert: {
                    business_profile_id: string
                    data: Json
                    section_name: Database["public"]["Enums"]["onboarding_section"]
                    updated_at?: string
                }
                Update: {
                    business_profile_id?: string
                    data?: Json
                    section_name?: Database["public"]["Enums"]["onboarding_section"]
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "business_onboarding_sections_business_profile_id_fkey"
                        columns: ["business_profile_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            business_profiles: {
                Row: {
                    abn: string
                    acn: string | null
                    business_structure: string
                    contact_emails: Json
                    contact_phones: Json
                    created_at: string
                    full_name: string
                    gst_registered: boolean
                    id: string
                    main_contact: Json
                    onboarding_complete_at: string | null
                    trading_name: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    abn: string
                    acn?: string | null
                    business_structure: string
                    contact_emails: Json
                    contact_phones: Json
                    created_at?: string
                    full_name: string
                    gst_registered?: boolean
                    id?: string
                    main_contact: Json
                    onboarding_complete_at?: string | null
                    trading_name: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    abn?: string
                    acn?: string | null
                    business_structure?: string
                    contact_emails?: Json
                    contact_phones?: Json
                    created_at?: string
                    full_name?: string
                    gst_registered?: boolean
                    id?: string
                    main_contact?: Json
                    onboarding_complete_at?: string | null
                    trading_name?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
            }
            mandatory_documents: {
                Row: {
                    doc_type: Database["public"]["Enums"]["document_type"]
                    mandatory: boolean
                    notes: string | null
                    section_name: Database["public"]["Enums"]["onboarding_section"]
                }
                Insert: {
                    doc_type: Database["public"]["Enums"]["document_type"]
                    mandatory?: boolean
                    notes?: string | null
                    section_name: Database["public"]["Enums"]["onboarding_section"]
                }
                Update: {
                    doc_type?: Database["public"]["Enums"]["document_type"]
                    mandatory?: boolean
                    notes?: string | null
                    section_name?: Database["public"]["Enums"]["onboarding_section"]
                }
                Relationships: []
            }
            onboarding_documents: {
                Row: {
                    business_profile_id: string
                    doc_type: Database["public"]["Enums"]["document_type"]
                    expiry_date: string | null
                    file_url: string
                    id: string
                    section_name: Database["public"]["Enums"]["onboarding_section"] | null
                    uploaded_at: string
                }
                Insert: {
                    business_profile_id: string
                    doc_type: Database["public"]["Enums"]["document_type"]
                    expiry_date?: string | null
                    file_url: string
                    id?: string
                    section_name?:
                    | Database["public"]["Enums"]["onboarding_section"]
                    | null
                    uploaded_at?: string
                }
                Update: {
                    business_profile_id?: string
                    doc_type?: Database["public"]["Enums"]["document_type"]
                    expiry_date?: string | null
                    file_url?: string
                    id?: string
                    section_name?:
                    | Database["public"]["Enums"]["onboarding_section"]
                    | null
                    uploaded_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "onboarding_documents_business_profile_id_fkey"
                        columns: ["business_profile_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            onboarding_progress: {
                Row: {
                    business_profile_id: string
                    completed_steps: Database["public"]["Enums"]["onboarding_section"][]
                    current_step: Database["public"]["Enums"]["onboarding_section"]
                }
                Insert: {
                    business_profile_id: string
                    completed_steps?: Database["public"]["Enums"]["onboarding_section"][]
                    current_step: Database["public"]["Enums"]["onboarding_section"]
                }
                Update: {
                    business_profile_id?: string
                    completed_steps?: Database["public"]["Enums"]["onboarding_section"][]
                    current_step?: Database["public"]["Enums"]["onboarding_section"]
                }
                Relationships: [
                    {
                        foreignKeyName: "onboarding_progress_business_profile_id_fkey"
                        columns: ["business_profile_id"]
                        isOneToOne: true
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    id: string
                    updated_at: string | null
                    username: string | null
                    website: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Relationships: []
            }
            signed_agreements: {
                Row: {
                    agreement: Database["public"]["Enums"]["agreement_type"]
                    business_profile_id: string
                    file_url: string | null
                    id: string
                    signed_at: string
                    signed_by_user: string
                }
                Insert: {
                    agreement: Database["public"]["Enums"]["agreement_type"]
                    business_profile_id: string
                    file_url?: string | null
                    id?: string
                    signed_at?: string
                    signed_by_user: string
                }
                Update: {
                    agreement?: Database["public"]["Enums"]["agreement_type"]
                    business_profile_id?: string
                    file_url?: string | null
                    id?: string
                    signed_at?: string
                    signed_by_user?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "signed_agreements_business_profile_id_fkey"
                        columns: ["business_profile_id"]
                        isOneToOne: false
                        referencedRelation: "business_profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            agreement_type:
            | "service_agreement"
            | "privacy_consent"
            | "direct_debit"
            | "terms_and_conditions"
            document_type:
            | "abn_certificate"
            | "acn_certificate"
            | "gst_registration_notice"
            | "chemical_handling_licence"
            | "machinery_operator_licence"
            | "food_safety_cert"
            | "water_licence"
            | "bank_feed_authority"
            | "bas_statement"
            | "public_liability_policy"
            | "workers_comp_policy"
            | "vehicle_insurance_policy"
            | "crop_or_livestock_policy"
            | "vehicle_registration_certificate"
            | "equipment_lease_agreement"
            | "land_lease_agreement"
            | "service_agreement"
            | "privacy_consent"
            | "direct_debit_authority"
            onboarding_section:
            | "basic"
            | "farm"
            | "financial"
            | "compliance"
            | "storage"
            | "communications"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Application-specific type aliases for easier use
export type OnboardingSection = Database["public"]["Enums"]["onboarding_section"];
export type DocumentType = Database["public"]["Enums"]["document_type"];
export type AgreementType = Database["public"]["Enums"]["agreement_type"];

// Business Profile interfaces for application use
export interface MainContact {
    name: string;
    title: string;
}

export interface ContactEmails {
    accounts: string;
    admin: string;
    personal?: string;
}

export interface ContactPhones {
    primary: string;
    secondary?: string;
    mobile?: string;
}

export interface BusinessProfile {
    id: string;
    user_id: string;
    // Basic legal identity
    full_name: string;
    trading_name: string;
    abn: string;
    acn?: string | null;
    gst_registered: boolean;
    // Contacts (stored as JSONB in database)
    main_contact: MainContact;
    contact_emails: ContactEmails;
    contact_phones: ContactPhones;
    business_structure: string;
    onboarding_complete_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: string;
    business_profile_id: string;
    address_type: 'postal' | 'property';
    line1: string;
    line2?: string | null;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    is_primary: boolean;
}

export interface BusinessOnboardingSection {
    business_profile_id: string;
    section_name: OnboardingSection;
    data: Record<string, unknown>;
    updated_at: string;
}

export interface OnboardingDocument {
    id: string;
    business_profile_id: string;
    section_name?: OnboardingSection | null;
    doc_type: DocumentType;
    file_url: string;
    expiry_date?: string | null;
    uploaded_at: string;
}

export interface SignedAgreement {
    id: string;
    business_profile_id: string;
    agreement: AgreementType;
    signed_by_user: string;
    signed_at: string;
    file_url?: string | null;
}

export interface OnboardingProgress {
    business_profile_id: string;
    current_step: OnboardingSection;
    completed_steps: OnboardingSection[];
}

export interface MandatoryDocument {
    section_name: OnboardingSection;
    doc_type: DocumentType;
    mandatory: boolean;
    notes?: string | null;
}

// Form data interfaces for each section
export interface BasicSectionData {
    full_name: string;
    trading_name: string;
    abn: string;
    acn?: string;
    gst_registered: boolean;
    main_contact: MainContact;
    contact_emails: ContactEmails;
    contact_phones: ContactPhones;
    business_structure: string;
    postal_address?: Address;
    property_addresses?: Address[];
}

export interface FarmSectionData {
    main_farming_activities: string[];
    key_staff: Array<{
        name: string;
        role: string;
        qualifications?: string;
    }>;
    licenses_held: string[];
    chemical_usage: boolean;
    livestock_numbers?: Record<string, number>;
    crop_types: string[];
    water_license: boolean;
}

export interface FinancialSectionData {
    bookkeeping_software: string;
    bank_feeds_setup: boolean;
    accountant_details?: {
        name: string;
        contact: string;
    };
    bas_agent_details?: {
        name: string;
        contact: string;
    };
    bas_frequency: string;
    payroll_needs: boolean;
    num_employees: number;
    payroll_software?: string;
}

export interface ComplianceSectionData {
    vehicles: Array<{
        type: string;
        registration: string;
        insurance_expiry: string;
    }>;
    insurance_policies: Array<{
        type: string;
        provider: string;
        expiry_date: string;
        policy_number: string;
    }>;
    license_expiry_dates: Record<string, string>;
    contract_expiry_dates: Record<string, string>;
    suppliers: Array<{
        name: string;
        contact: string;
        services: string;
    }>;
}

export interface StorageSectionData {
    cloud_storage_type: string;
    access_granted: boolean;
    filing_preference: string;
}

export interface CommunicationsSectionData {
    preferred_method: string;
    preferred_times: string[];
    reporting_frequency: string;
} 