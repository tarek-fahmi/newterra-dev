import supabase from '../supabase';
import {
    BusinessProfile,
    Address,
    BusinessOnboardingSection,
    OnboardingDocument,
    SignedAgreement,
    OnboardingProgress,
    MandatoryDocument,
    OnboardingSection,
    DocumentType,
    AgreementType,
} from '../types/database';

// Business Profile operations
export const businessProfileApi = {
    async create(profileData: Omit<BusinessProfile, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('business_profiles')
            .insert(profileData)
            .select()
            .single();

        if (error) throw error;
        return data as BusinessProfile;
    },

    async getByUserId(userId: string) {
        const { data, error } = await supabase
            .from('business_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as BusinessProfile | null;
    },

    async update(id: string, updates: Partial<BusinessProfile>) {
        const { data, error } = await supabase
            .from('business_profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as BusinessProfile;
    },

    async markOnboardingComplete(id: string) {
        const { data, error } = await supabase
            .from('business_profiles')
            .update({
                onboarding_complete_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as BusinessProfile;
    },
};

// Address operations
export const addressApi = {
    async create(addressData: Omit<Address, 'id'>) {
        const { data, error } = await supabase
            .from('addresses')
            .insert(addressData)
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async getByBusinessProfile(businessProfileId: string) {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('business_profile_id', businessProfileId);

        if (error) throw error;
        return data as Address[];
    },

    async update(id: string, updates: Partial<Address>) {
        const { data, error } = await supabase
            .from('addresses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};

// Onboarding sections operations
export const onboardingSectionApi = {
    async upsert(businessProfileId: string, sectionName: OnboardingSection, data: Record<string, unknown>) {
        const { data: result, error } = await supabase
            .from('business_onboarding_sections')
            .upsert({
                business_profile_id: businessProfileId,
                section_name: sectionName,
                data,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return result as BusinessOnboardingSection;
    },

    async get(businessProfileId: string, sectionName: OnboardingSection) {
        const { data, error } = await supabase
            .from('business_onboarding_sections')
            .select('*')
            .eq('business_profile_id', businessProfileId)
            .eq('section_name', sectionName)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as BusinessOnboardingSection | null;
    },

    async getAll(businessProfileId: string) {
        const { data, error } = await supabase
            .from('business_onboarding_sections')
            .select('*')
            .eq('business_profile_id', businessProfileId);

        if (error) throw error;
        return data as BusinessOnboardingSection[];
    },
};

// Document operations
export const documentApi = {
    async upload(documentData: Omit<OnboardingDocument, 'id' | 'uploaded_at'>) {
        const { data, error } = await supabase
            .from('onboarding_documents')
            .insert({
                ...documentData,
                uploaded_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data as OnboardingDocument;
    },

    async getByBusinessProfile(businessProfileId: string) {
        const { data, error } = await supabase
            .from('onboarding_documents')
            .select('*')
            .eq('business_profile_id', businessProfileId);

        if (error) throw error;
        return data as OnboardingDocument[];
    },

    async getBySection(businessProfileId: string, sectionName: OnboardingSection) {
        const { data, error } = await supabase
            .from('onboarding_documents')
            .select('*')
            .eq('business_profile_id', businessProfileId)
            .eq('section_name', sectionName);

        if (error) throw error;
        return data as OnboardingDocument[];
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('onboarding_documents')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Upload file to Supabase Storage
    async uploadFile(file: File, businessProfileId: string, docType: DocumentType) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessProfileId}/${docType}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    },
};

// Signed agreements operations
export const agreementApi = {
    async sign(businessProfileId: string, agreementType: AgreementType, signedByUser: string, fileUrl?: string) {
        const { data, error } = await supabase
            .from('signed_agreements')
            .upsert({
                business_profile_id: businessProfileId,
                agreement: agreementType,
                signed_by_user: signedByUser,
                signed_at: new Date().toISOString(),
                file_url: fileUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data as SignedAgreement;
    },

    async getByBusinessProfile(businessProfileId: string) {
        const { data, error } = await supabase
            .from('signed_agreements')
            .select('*')
            .eq('business_profile_id', businessProfileId);

        if (error) throw error;
        return data as SignedAgreement[];
    },

    async checkAgreementSigned(businessProfileId: string, agreementType: AgreementType) {
        const { data, error } = await supabase
            .from('signed_agreements')
            .select('*')
            .eq('business_profile_id', businessProfileId)
            .eq('agreement', agreementType)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as SignedAgreement | null;
    },
};

// Onboarding progress operations
export const progressApi = {
    async upsert(businessProfileId: string, currentStep: OnboardingSection, completedSteps: OnboardingSection[]) {
        const { data, error } = await supabase
            .from('onboarding_progress')
            .upsert({
                business_profile_id: businessProfileId,
                current_step: currentStep,
                completed_steps: completedSteps
            })
            .select()
            .single();

        if (error) throw error;
        return data as OnboardingProgress;
    },

    async get(businessProfileId: string) {
        const { data, error } = await supabase
            .from('onboarding_progress')
            .select('*')
            .eq('business_profile_id', businessProfileId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as OnboardingProgress | null;
    },

    async markStepComplete(businessProfileId: string, step: OnboardingSection) {
        const progress = await this.get(businessProfileId);
        const completedSteps = progress?.completed_steps || [];

        if (!completedSteps.includes(step)) {
            completedSteps.push(step);
        }

        // Determine next step
        const stepOrder: OnboardingSection[] = ['basic', 'farm', 'financial', 'compliance', 'storage', 'communications'];
        const currentIndex = stepOrder.indexOf(step);
        const nextStep = stepOrder[currentIndex + 1] || step;

        return this.upsert(businessProfileId, nextStep, completedSteps);
    },
};

// Mandatory documents operations
export const mandatoryDocumentApi = {
    async getBySection(sectionName: OnboardingSection) {
        const { data, error } = await supabase
            .from('mandatory_documents')
            .select('*')
            .eq('section_name', sectionName);

        if (error) throw error;
        return data as MandatoryDocument[];
    },

    async getAll() {
        const { data, error } = await supabase
            .from('mandatory_documents')
            .select('*');

        if (error) throw error;
        return data as MandatoryDocument[];
    },

    async getMandatoryForSection(sectionName: OnboardingSection) {
        const { data, error } = await supabase
            .from('mandatory_documents')
            .select('*')
            .eq('section_name', sectionName)
            .eq('mandatory', true);

        if (error) throw error;
        return data as MandatoryDocument[];
    },
};

// Utility functions
export const onboardingUtils = {
    async getOnboardingStatus(businessProfileId: string) {
        const [progress, documents, agreements] = await Promise.all([
            progressApi.get(businessProfileId),
            documentApi.getByBusinessProfile(businessProfileId),
            agreementApi.getByBusinessProfile(businessProfileId)
        ]);

        const allSections: OnboardingSection[] = ['basic', 'farm', 'financial', 'compliance', 'storage', 'communications'];
        const completedSteps = progress?.completed_steps || [];
        const currentStep = progress?.current_step || 'basic';

        const sectionProgress = allSections.map(section => ({
            section,
            completed: completedSteps.includes(section),
            isCurrent: section === currentStep
        }));

        return {
            progress: sectionProgress,
            currentStep,
            completedSteps,
            documents,
            agreements,
            isComplete: completedSteps.length === allSections.length
        };
    },

    async checkSectionRequirements(businessProfileId: string, sectionName: OnboardingSection) {
        const [mandatoryDocs, uploadedDocs] = await Promise.all([
            mandatoryDocumentApi.getMandatoryForSection(sectionName),
            documentApi.getBySection(businessProfileId, sectionName)
        ]);

        const missingDocs = mandatoryDocs.filter(mandatoryDoc =>
            !uploadedDocs.some(uploadedDoc => uploadedDoc.doc_type === mandatoryDoc.doc_type)
        );

        return {
            required: mandatoryDocs,
            uploaded: uploadedDocs,
            missing: missingDocs,
            canProceed: missingDocs.length === 0
        };
    }
}; 