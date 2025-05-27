import { useState, useEffect } from 'react';
import { useBusinessProfile } from './useBusinessProfile';
import {
    onboardingSectionApi,
    progressApi,
    documentApi,
    agreementApi,
    mandatoryDocumentApi,
    onboardingUtils
} from '../lib/api';
import {
    OnboardingSection,
    BusinessOnboardingSection,
    OnboardingProgress,
    OnboardingDocument,
    SignedAgreement,
    DocumentType,
    AgreementType
} from '../types/database';

export function useOnboarding() {
    const { businessProfile } = useBusinessProfile();
    const [currentSection, setCurrentSection] = useState<OnboardingSection>('basic');
    const [progress, setProgress] = useState<OnboardingProgress | null>(null);
    const [sectionData, setSectionData] = useState<Record<OnboardingSection, Record<string, unknown>>>({
        basic: {},
        farm: {},
        financial: {},
        compliance: {},
        storage: {},
        communications: {}
    });
    const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
    const [agreements, setAgreements] = useState<SignedAgreement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (businessProfile) {
            loadOnboardingData();
        }
    }, [businessProfile]);

    const loadOnboardingData = async () => {
        if (!businessProfile) return;

        try {
            setLoading(true);
            const [progressData, sectionsData, documentsData, agreementsData] = await Promise.all([
                progressApi.get(businessProfile.id),
                onboardingSectionApi.getAll(businessProfile.id),
                documentApi.getByBusinessProfile(businessProfile.id),
                agreementApi.getByBusinessProfile(businessProfile.id)
            ]);

            setProgress(progressData);
            setCurrentSection(progressData?.current_step || 'basic');

            // Organize section data
            const organizedSectionData: Record<OnboardingSection, Record<string, unknown>> = {
                basic: {},
                farm: {},
                financial: {},
                compliance: {},
                storage: {},
                communications: {}
            };

            sectionsData.forEach(section => {
                organizedSectionData[section.section_name] = section.data;
            });

            setSectionData(organizedSectionData);
            setDocuments(documentsData);
            setAgreements(agreementsData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load onboarding data');
        } finally {
            setLoading(false);
        }
    };

    const saveSectionData = async (section: OnboardingSection, data: Record<string, unknown>) => {
        if (!businessProfile) throw new Error('No business profile');

        try {
            setLoading(true);
            await onboardingSectionApi.upsert(businessProfile.id, section, data);
            setSectionData(prev => ({ ...prev, [section]: data }));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save section data');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completeSection = async (section: OnboardingSection) => {
        if (!businessProfile) throw new Error('No business profile');

        try {
            setLoading(true);
            const updatedProgress = await progressApi.markStepComplete(businessProfile.id, section);
            setProgress(updatedProgress);
            setCurrentSection(updatedProgress.current_step);
            setError(null);
            return updatedProgress;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete section');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file: File, docType: DocumentType, section?: OnboardingSection) => {
        if (!businessProfile) throw new Error('No business profile');

        try {
            setLoading(true);
            const fileUrl = await documentApi.uploadFile(file, businessProfile.id, docType);
            const document = await documentApi.upload({
                business_profile_id: businessProfile.id,
                section_name: section,
                doc_type: docType,
                file_url: fileUrl
            });

            setDocuments(prev => [...prev, document]);
            setError(null);
            return document;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload document');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId: string) => {
        try {
            setLoading(true);
            await documentApi.delete(documentId);
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete document');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signAgreement = async (agreementType: AgreementType, userId: string, fileUrl?: string) => {
        if (!businessProfile) throw new Error('No business profile');

        try {
            setLoading(true);
            const agreement = await agreementApi.sign(businessProfile.id, agreementType, userId, fileUrl);
            setAgreements(prev => [...prev.filter(a => a.agreement !== agreementType), agreement]);
            setError(null);
            return agreement;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign agreement');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getDocumentsForSection = (section: OnboardingSection) => {
        return documents.filter(doc => doc.section_name === section);
    };

    const getSectionRequirements = async (section: OnboardingSection) => {
        if (!businessProfile) return null;

        try {
            return await onboardingUtils.checkSectionRequirements(businessProfile.id, section);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get section requirements');
            throw err;
        }
    };

    const getOverallStatus = async () => {
        if (!businessProfile) return null;

        try {
            return await onboardingUtils.getOnboardingStatus(businessProfile.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get overall status');
            throw err;
        }
    };

    const isAgreementSigned = (agreementType: AgreementType) => {
        return agreements.some(agreement => agreement.agreement === agreementType);
    };

    const isSectionComplete = (section: OnboardingSection) => {
        return progress?.completed_steps.includes(section) || false;
    };

    const canProceedToNextSection = async (section: OnboardingSection) => {
        const requirements = await getSectionRequirements(section);
        return requirements?.canProceed || false;
    };

    const navigateToSection = (section: OnboardingSection) => {
        setCurrentSection(section);
    };

    const getNextSection = (): OnboardingSection | null => {
        const sections: OnboardingSection[] = ['basic', 'farm', 'financial', 'compliance', 'storage', 'communications'];
        const currentIndex = sections.indexOf(currentSection);
        return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
    };

    const getPreviousSection = (): OnboardingSection | null => {
        const sections: OnboardingSection[] = ['basic', 'farm', 'financial', 'compliance', 'storage', 'communications'];
        const currentIndex = sections.indexOf(currentSection);
        return currentIndex > 0 ? sections[currentIndex - 1] : null;
    };

    return {
        // State
        currentSection,
        progress,
        sectionData,
        documents,
        agreements,
        loading,
        error,

        // Actions
        saveSectionData,
        completeSection,
        uploadDocument,
        deleteDocument,
        signAgreement,
        navigateToSection,

        // Utilities
        getDocumentsForSection,
        getSectionRequirements,
        getOverallStatus,
        isAgreementSigned,
        isSectionComplete,
        canProceedToNextSection,
        getNextSection,
        getPreviousSection,
        reload: loadOnboardingData,
    };
} 