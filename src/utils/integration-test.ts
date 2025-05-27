import {
    businessProfileApi,
    onboardingSectionApi,
    progressApi,
    agreementApi,
    mandatoryDocumentApi,
    onboardingUtils
} from '../lib/api';
import { OnboardingSection, AgreementType } from '../types/database';

interface TestResults {
    passed: number;
    failed: number;
    results: Array<{
        test: string;
        status: 'PASS' | 'FAIL';
        message: string;
        error?: unknown;
    }>;
}

/**
 * Comprehensive integration test for the onboarding system
 * Tests the complete flow from business profile creation to completion
 */
export async function runIntegrationTest(testUserId: string): Promise<TestResults> {
    const results: TestResults = {
        passed: 0,
        failed: 0,
        results: []
    };

    const addResult = (test: string, status: 'PASS' | 'FAIL', message: string, error?: unknown) => {
        results.results.push({ test, status, message, error });
        if (status === 'PASS') results.passed++;
        else results.failed++;
    };

    console.log('🧪 Starting Onboarding Integration Test...');
    console.log(`👤 Test User ID: ${testUserId}`);

    let businessProfileId: string | null = null;

    try {
        // Test 1: Check if user already has a business profile
        console.log('\n📋 Test 1: Check existing business profile');
        try {
            const existingProfile = await businessProfileApi.getByUserId(testUserId);
            if (existingProfile) {
                businessProfileId = existingProfile.id;
                addResult('existing_profile_check', 'PASS', `Found existing profile: ${existingProfile.id}`);
                console.log(`✅ Found existing business profile: ${existingProfile.id}`);
            } else {
                addResult('existing_profile_check', 'PASS', 'No existing profile found (as expected)');
                console.log('✅ No existing profile found (ready for testing)');
            }
        } catch (error) {
            addResult('existing_profile_check', 'FAIL', 'Failed to check existing profile', error);
            console.error('❌ Failed to check existing profile:', error);
        }

        // Test 2: Create business profile (if not exists)
        if (!businessProfileId) {
            console.log('\n📋 Test 2: Create business profile');
            try {
                const testProfileData = {
                    user_id: testUserId,
                    full_name: 'Test Business Pty Ltd',
                    trading_name: 'Test Business',
                    abn: '12345678901',
                    acn: '123456789',
                    gst_registered: true,
                    main_contact: {
                        name: 'John Doe',
                        title: 'Managing Director'
                    },
                    contact_emails: {
                        accounts: 'accounts@testbusiness.com.au',
                        admin: 'admin@testbusiness.com.au',
                        personal: 'john@testbusiness.com.au'
                    },
                    contact_phones: {
                        primary: '+61 2 1234 5678',
                        secondary: '+61 2 1234 5679',
                        mobile: '+61 412 345 678'
                    },
                    business_structure: 'company'
                };

                const newProfile = await businessProfileApi.create(testProfileData);
                businessProfileId = newProfile.id;
                addResult('create_profile', 'PASS', `Created business profile: ${newProfile.id}`);
                console.log(`✅ Created business profile: ${newProfile.id}`);
            } catch (error) {
                addResult('create_profile', 'FAIL', 'Failed to create business profile', error);
                console.error('❌ Failed to create business profile:', error);
                return results; // Cannot continue without business profile
            }
        }

        // Test 3: Save section data
        console.log('\n📋 Test 3: Save basic section data');
        try {
            const basicSectionData = {
                full_name: 'Test Business Pty Ltd',
                trading_name: 'Test Business',
                abn: '12345678901',
                acn: '123456789',
                gst_registered: true,
                main_contact: {
                    name: 'John Doe',
                    title: 'Managing Director'
                },
                contact_emails: {
                    accounts: 'accounts@testbusiness.com.au',
                    admin: 'admin@testbusiness.com.au'
                },
                contact_phones: {
                    primary: '+61 2 1234 5678'
                },
                business_structure: 'company'
            };

            await onboardingSectionApi.upsert(businessProfileId!, 'basic', basicSectionData);
            addResult('save_section_data', 'PASS', 'Successfully saved basic section data');
            console.log('✅ Saved basic section data');
        } catch (error) {
            addResult('save_section_data', 'FAIL', 'Failed to save section data', error);
            console.error('❌ Failed to save section data:', error);
        }

        // Test 4: Create/update progress
        console.log('\n📋 Test 4: Update onboarding progress');
        try {
            const progress = await progressApi.markStepComplete(businessProfileId!, 'basic');
            addResult('update_progress', 'PASS', `Progress updated: current step ${progress.current_step}`);
            console.log(`✅ Progress updated: current step ${progress.current_step}`);
        } catch (error) {
            addResult('update_progress', 'FAIL', 'Failed to update progress', error);
            console.error('❌ Failed to update progress:', error);
        }

        // Test 5: Sign agreements
        console.log('\n📋 Test 5: Sign service agreement');
        try {
            const agreement = await agreementApi.sign(businessProfileId!, 'service_agreement', testUserId);
            addResult('sign_agreement', 'PASS', `Signed agreement: ${agreement.id}`);
            console.log(`✅ Signed service agreement: ${agreement.id}`);
        } catch (error) {
            addResult('sign_agreement', 'FAIL', 'Failed to sign agreement', error);
            console.error('❌ Failed to sign agreement:', error);
        }

        // Test 6: Check mandatory documents
        console.log('\n📋 Test 6: Check mandatory documents');
        try {
            const mandatoryDocs = await mandatoryDocumentApi.getMandatoryForSection('basic');
            addResult('check_mandatory_docs', 'PASS', `Found ${mandatoryDocs.length} mandatory documents for basic section`);
            console.log(`✅ Found ${mandatoryDocs.length} mandatory documents for basic section`);
        } catch (error) {
            addResult('check_mandatory_docs', 'FAIL', 'Failed to check mandatory documents', error);
            console.error('❌ Failed to check mandatory documents:', error);
        }

        // Test 7: Get onboarding status
        console.log('\n📋 Test 7: Get overall onboarding status');
        try {
            const status = await onboardingUtils.getOnboardingStatus(businessProfileId!);
            addResult('get_status', 'PASS', `Status check completed. Complete: ${status.isComplete}`);
            console.log(`✅ Status check completed. Complete: ${status.isComplete}`);
            console.log(`   Current step: ${status.currentStep}`);
            console.log(`   Completed steps: ${status.completedSteps.join(', ')}`);
        } catch (error) {
            addResult('get_status', 'FAIL', 'Failed to get onboarding status', error);
            console.error('❌ Failed to get onboarding status:', error);
        }

        // Test 8: Check section requirements
        console.log('\n📋 Test 8: Check section requirements');
        try {
            const requirements = await onboardingUtils.checkSectionRequirements(businessProfileId!, 'basic');
            addResult('check_requirements', 'PASS', `Requirements check completed. Can proceed: ${requirements.canProceed}`);
            console.log(`✅ Requirements check completed. Can proceed: ${requirements.canProceed}`);
            console.log(`   Missing documents: ${requirements.missing.length}`);
        } catch (error) {
            addResult('check_requirements', 'FAIL', 'Failed to check section requirements', error);
            console.error('❌ Failed to check section requirements:', error);
        }

        // Test 9: Retrieve all data
        console.log('\n📋 Test 9: Retrieve all onboarding data');
        try {
            const [sections, progress, documents, agreements] = await Promise.all([
                onboardingSectionApi.getAll(businessProfileId!),
                progressApi.get(businessProfileId!),
                // documentApi.getByBusinessProfile(businessProfileId!), // Skip for now
                // agreementApi.getByBusinessProfile(businessProfileId!)  // Skip for now
            ]);

            addResult('retrieve_data', 'PASS', `Retrieved ${sections.length} sections, progress data available`);
            console.log(`✅ Retrieved ${sections.length} sections, progress data available`);
        } catch (error) {
            addResult('retrieve_data', 'FAIL', 'Failed to retrieve onboarding data', error);
            console.error('❌ Failed to retrieve onboarding data:', error);
        }

    } catch (error) {
        addResult('general_error', 'FAIL', 'Unexpected error during testing', error);
        console.error('❌ Unexpected error during testing:', error);
    }

    console.log('\n📊 Integration Test Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

    return results;
}

/**
 * Quick smoke test to verify basic connectivity
 */
export async function runSmokeTest(): Promise<{ success: boolean; message: string }> {
    try {
        console.log('🔥 Running smoke test...');

        // Test basic table access
        const tableTests = await Promise.all([
            businessProfileApi.getByUserId('test'),
            mandatoryDocumentApi.getAll()
        ]);

        console.log('✅ Smoke test passed - basic connectivity verified');
        return { success: true, message: 'Smoke test passed' };
    } catch (error) {
        console.error('❌ Smoke test failed:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Clean up test data (optional)
 */
export async function cleanupTestData(businessProfileId: string): Promise<void> {
    console.log('🧹 Cleaning up test data...');

    try {
        // Note: Be careful with this in production!
        // await businessProfileApi.delete(businessProfileId);
        console.log('⚠️ Cleanup skipped for safety (would delete business profile)');
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
    }
} 