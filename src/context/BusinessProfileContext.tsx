import React, { createContext, useContext, ReactNode } from 'react';
import { useBusinessProfile } from '../hooks/useBusinessProfile';
import { useOnboarding } from '../hooks/useOnboarding';
import {
    BusinessProfile,
    OnboardingSection,
    OnboardingProgress,
    OnboardingDocument,
    SignedAgreement,
    MandatoryDocument,
    DocumentType,
    AgreementType
} from '../types/database';

interface BusinessProfileContextType {
    // Business Profile
    businessProfile: BusinessProfile | null;
    profileLoading: boolean;
    profileError: string | null;
    createBusinessProfile: (profileData: Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<BusinessProfile>;
    updateBusinessProfile: (updates: Partial<BusinessProfile>) => Promise<BusinessProfile>;
    markOnboardingComplete: () => Promise<BusinessProfile>;
    getOnboardingStatus: () => Promise<{
        progress: Array<{
            section: OnboardingSection;
            completed: boolean;
            isCurrent: boolean;
        }>;
        currentStep: OnboardingSection;
        completedSteps: OnboardingSection[];
        documents: OnboardingDocument[];
        agreements: SignedAgreement[];
        isComplete: boolean;
    } | null>;
    reloadProfile: () => Promise<void>;

    // Onboarding
    currentSection: OnboardingSection;
    progress: OnboardingProgress | null;
    sectionData: Record<OnboardingSection, Record<string, unknown>>;
    documents: OnboardingDocument[];
    agreements: SignedAgreement[];
    onboardingLoading: boolean;
    onboardingError: string | null;
    saveSectionData: (section: OnboardingSection, data: Record<string, unknown>) => Promise<void>;
    completeSection: (section: OnboardingSection) => Promise<OnboardingProgress>;
    uploadDocument: (file: File, docType: DocumentType, section?: OnboardingSection) => Promise<OnboardingDocument>;
    deleteDocument: (documentId: string) => Promise<void>;
    signAgreement: (agreementType: AgreementType, userId: string, fileUrl?: string) => Promise<SignedAgreement>;
    navigateToSection: (section: OnboardingSection) => void;
    getDocumentsForSection: (section: OnboardingSection) => OnboardingDocument[];
    getSectionRequirements: (section: OnboardingSection) => Promise<{
        required: MandatoryDocument[];
        uploaded: OnboardingDocument[];
        missing: MandatoryDocument[];
        canProceed: boolean;
    } | null>;
    getOverallStatus: () => Promise<{
        progress: Array<{
            section: OnboardingSection;
            completed: boolean;
            isCurrent: boolean;
        }>;
        currentStep: OnboardingSection;
        completedSteps: OnboardingSection[];
        documents: OnboardingDocument[];
        agreements: SignedAgreement[];
        isComplete: boolean;
    } | null>;
    isAgreementSigned: (agreementType: AgreementType) => boolean;
    isSectionComplete: (section: OnboardingSection) => boolean;
    canProceedToNextSection: (section: OnboardingSection) => Promise<boolean>;
    getNextSection: () => OnboardingSection | null;
    getPreviousSection: () => OnboardingSection | null;
    reloadOnboarding: () => Promise<void>;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

interface BusinessProfileProviderProps {
    children: ReactNode;
}

export function BusinessProfileProvider({ children }: BusinessProfileProviderProps) {
    const businessProfileHook = useBusinessProfile();
    const onboardingHook = useOnboarding();

    const contextValue: BusinessProfileContextType = {
        // Business Profile
        businessProfile: businessProfileHook.businessProfile,
        profileLoading: businessProfileHook.loading,
        profileError: businessProfileHook.error,
        createBusinessProfile: businessProfileHook.createBusinessProfile,
        updateBusinessProfile: businessProfileHook.updateBusinessProfile,
        markOnboardingComplete: businessProfileHook.markOnboardingComplete,
        getOnboardingStatus: businessProfileHook.getOnboardingStatus,
        reloadProfile: businessProfileHook.reload,

        // Onboarding
        currentSection: onboardingHook.currentSection,
        progress: onboardingHook.progress,
        sectionData: onboardingHook.sectionData,
        documents: onboardingHook.documents,
        agreements: onboardingHook.agreements,
        onboardingLoading: onboardingHook.loading,
        onboardingError: onboardingHook.error,
        saveSectionData: onboardingHook.saveSectionData,
        completeSection: onboardingHook.completeSection,
        uploadDocument: onboardingHook.uploadDocument,
        deleteDocument: onboardingHook.deleteDocument,
        signAgreement: onboardingHook.signAgreement,
        navigateToSection: onboardingHook.navigateToSection,
        getDocumentsForSection: onboardingHook.getDocumentsForSection,
        getSectionRequirements: onboardingHook.getSectionRequirements,
        getOverallStatus: onboardingHook.getOverallStatus,
        isAgreementSigned: onboardingHook.isAgreementSigned,
        isSectionComplete: onboardingHook.isSectionComplete,
        canProceedToNextSection: onboardingHook.canProceedToNextSection,
        getNextSection: onboardingHook.getNextSection,
        getPreviousSection: onboardingHook.getPreviousSection,
        reloadOnboarding: onboardingHook.reload,
    };

    return (
        <BusinessProfileContext.Provider value={contextValue}>
            {children}
        </BusinessProfileContext.Provider>
    );
}

export function useBusinessProfileContext() {
    const context = useContext(BusinessProfileContext);
    if (context === undefined) {
        throw new Error('useBusinessProfileContext must be used within a BusinessProfileProvider');
    }
    return context;
} 