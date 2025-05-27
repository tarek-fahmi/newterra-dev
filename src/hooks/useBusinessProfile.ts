import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { businessProfileApi, onboardingUtils } from '../lib/api';
import { BusinessProfile } from '../types/database';

export function useBusinessProfile() {
    const { user } = useAuth();
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadBusinessProfile();
        } else {
            setBusinessProfile(null);
            setLoading(false);
        }
    }, [user]);

    const loadBusinessProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const profile = await businessProfileApi.getByUserId(user.id);
            setBusinessProfile(profile);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load business profile');
        } finally {
            setLoading(false);
        }
    };

    const createBusinessProfile = async (profileData: Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        if (!user) throw new Error('User not authenticated');

        try {
            setLoading(true);
            const newProfile = await businessProfileApi.create({
                ...profileData,
                user_id: user.id,
            });
            setBusinessProfile(newProfile);
            setError(null);
            return newProfile;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create business profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
        if (!businessProfile) throw new Error('No business profile to update');

        try {
            setLoading(true);
            const updatedProfile = await businessProfileApi.update(businessProfile.id, updates);
            setBusinessProfile(updatedProfile);
            setError(null);
            return updatedProfile;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update business profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markOnboardingComplete = async () => {
        if (!businessProfile) throw new Error('No business profile');

        try {
            setLoading(true);
            const updatedProfile = await businessProfileApi.markOnboardingComplete(businessProfile.id);
            setBusinessProfile(updatedProfile);
            setError(null);
            return updatedProfile;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark onboarding complete');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getOnboardingStatus = async () => {
        if (!businessProfile) return null;

        try {
            return await onboardingUtils.getOnboardingStatus(businessProfile.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get onboarding status');
            throw err;
        }
    };

    return {
        businessProfile,
        loading,
        error,
        createBusinessProfile,
        updateBusinessProfile,
        markOnboardingComplete,
        getOnboardingStatus,
        reload: loadBusinessProfile,
    };
} 