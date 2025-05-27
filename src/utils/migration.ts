import { businessProfileApi, onboardingSectionApi, progressApi } from '../lib/api';
import { OnboardingSection } from '../types/database';

/**
 * Migration utilities for transitioning from old onboarding system to new schema
 */

interface OldFormData {
    // Old form structure - adjust based on your existing data
    businessName?: string;
    tradingName?: string;
    abn?: string;
    acn?: string;
    gstRegistered?: string | boolean;
    mainContactName?: string;
    mainContactTitle?: string;
    contactEmailAccounts?: string;
    contactEmailAdmin?: string;
    contactEmailPersonal?: string;
    contactPhone?: string;
    businessStructure?: string;
    // Add other old fields as needed
    [key: string]: unknown;
}

/**
 * Convert old form data to new business profile format
 */
export function convertOldDataToBusinessProfile(oldData: OldFormData, userId: string) {
    return {
        user_id: userId,
        full_name: oldData.businessName || '',
        trading_name: oldData.tradingName || oldData.businessName || '',
        abn: oldData.abn || '',
        acn: oldData.acn || undefined,
        gst_registered: oldData.gstRegistered === 'yes' || oldData.gstRegistered === true,
        main_contact: {
            name: oldData.mainContactName || '',
            title: oldData.mainContactTitle || '',
        },
        contact_emails: {
            accounts: oldData.contactEmailAccounts || '',
            admin: oldData.contactEmailAdmin || '',
            personal: oldData.contactEmailPersonal,
        },
        contact_phones: {
            primary: oldData.contactPhone || '',
            secondary: undefined,
            mobile: undefined,
        },
        business_structure: oldData.businessStructure || '',
    };
}

/**
 * Convert old form data to new section-based format
 */
export function convertOldDataToSections(oldData: OldFormData) {
    const sections: Record<OnboardingSection, Record<string, unknown>> = {
        basic: {
            full_name: oldData.businessName || '',
            trading_name: oldData.tradingName || '',
            abn: oldData.abn || '',
            acn: oldData.acn,
            gst_registered: oldData.gstRegistered === 'yes' || oldData.gstRegistered === true,
            main_contact: {
                name: oldData.mainContactName || '',
                title: oldData.mainContactTitle || '',
            },
            contact_emails: {
                accounts: oldData.contactEmailAccounts || '',
                admin: oldData.contactEmailAdmin || '',
                personal: oldData.contactEmailPersonal,
            },
            contact_phones: {
                primary: oldData.contactPhone || '',
            },
            business_structure: oldData.businessStructure || '',
        },
        farm: {
            main_farming_activities: oldData.mainFarmingActivities ? [oldData.mainFarmingActivities] : [],
            key_staff: oldData.keyStaff ? parseKeyStaff(oldData.keyStaff) : [],
            licenses_held: oldData.licensesHeld ? [oldData.licensesHeld] : [],
            chemical_usage: oldData.chemicalFertiliserUsage === 'yes',
            livestock_numbers: oldData.livestockNumbers ? parseLivestockNumbers(oldData.livestockNumbers) : {},
            crop_types: oldData.cropTypes ? [oldData.cropTypes] : [],
            water_license: oldData.waterLicences === 'yes',
        },
        financial: {
            bookkeeping_software: oldData.bookkeepingSoftware || '',
            bank_feeds_setup: oldData.bankFeedsSetup === 'yes',
            accountant_details: oldData.accountantDetails ? parseContactDetails(oldData.accountantDetails) : undefined,
            bas_agent_details: oldData.basAgentDetails ? parseContactDetails(oldData.basAgentDetails) : undefined,
            bas_frequency: oldData.basLodgementFrequency || '',
            payroll_needs: oldData.payrollProcessingNeeds === 'yes',
            num_employees: parseInt(oldData.payrollNumEmployees) || 0,
            payroll_software: oldData.payrollSoftware,
        },
        compliance: {
            vehicles: oldData.vehicleList ? parseVehicles(oldData.vehicleList) : [],
            insurance_policies: oldData.insurancePolicies ? parseInsurancePolicies(oldData.insurancePolicies) : [],
            license_expiry_dates: oldData.licenceExpiryDates ? parseDates(oldData.licenceExpiryDates) : {},
            contract_expiry_dates: oldData.contractExpiryDates ? parseDates(oldData.contractExpiryDates) : {},
            suppliers: oldData.suppliersList ? parseSuppliers(oldData.suppliersList) : [],
        },
        storage: {
            cloud_storage_type: oldData.cloudStorageDetails || '',
            access_granted: oldData.vaPermissionsGranted === 'yes',
            filing_preference: oldData.filingSystemPreference || '',
        },
        communications: {
            preferred_method: oldData.preferredCommunicationMethod || '',
            preferred_times: oldData.preferredContactTimes ? [oldData.preferredContactTimes] : [],
            reporting_frequency: oldData.reportingFrequency || '',
        },
    };

    return sections;
}

/**
 * Migrate a user's old onboarding data to the new system
 */
export async function migrateUserData(userId: string, oldFormData: OldFormData) {
    try {
        // 1. Create business profile
        const businessProfileData = convertOldDataToBusinessProfile(oldFormData, userId);
        const businessProfile = await businessProfileApi.create(businessProfileData);

        // 2. Convert and save section data
        const sectionData = convertOldDataToSections(oldFormData);

        for (const [sectionName, data] of Object.entries(sectionData)) {
            if (Object.keys(data).length > 0) {
                await onboardingSectionApi.upsert(
                    businessProfile.id,
                    sectionName as OnboardingSection,
                    data
                );
            }
        }

        // 3. Set up initial progress
        const completedSections = determineCompletedSections(oldFormData);
        await progressApi.upsert(
            businessProfile.id,
            completedSections.length > 0 ? completedSections[completedSections.length - 1] : 'basic',
            completedSections
        );

        return {
            success: true,
            businessProfile,
            message: 'Migration completed successfully',
        };
    } catch (error) {
        console.error('Migration failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Batch migrate multiple users
 */
export async function batchMigrateUsers(migrations: Array<{ userId: string; data: OldFormData }>) {
    const results = [];

    for (const migration of migrations) {
        try {
            const result = await migrateUserData(migration.userId, migration.data);
            results.push({
                userId: migration.userId,
                ...result,
            });
        } catch (error) {
            results.push({
                userId: migration.userId,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    return results;
}

/**
 * Helper functions for parsing old data formats
 */

function parseKeyStaff(keyStaffString: string) {
    // Assuming format like "John Doe - Manager, Jane Smith - Supervisor"
    try {
        return keyStaffString.split(',').map(staff => {
            const [name, role] = staff.trim().split(' - ');
            return { name: name?.trim() || '', role: role?.trim() || '' };
        });
    } catch {
        return [{ name: keyStaffString, role: '' }];
    }
}

function parseLivestockNumbers(livestockString: string) {
    // Assuming format like "Cattle: 50, Sheep: 100"
    try {
        const result: Record<string, number> = {};
        livestockString.split(',').forEach(item => {
            const [type, count] = item.trim().split(':');
            if (type && count) {
                result[type.trim()] = parseInt(count.trim()) || 0;
            }
        });
        return result;
    } catch {
        return {};
    }
}

function parseContactDetails(contactString: string) {
    // Assuming format like "Name: John Smith, Contact: john@example.com"
    try {
        const details = { name: '', contact: '' };
        contactString.split(',').forEach(item => {
            const [key, value] = item.trim().split(':');
            if (key && value) {
                const cleanKey = key.trim().toLowerCase();
                if (cleanKey === 'name') details.name = value.trim();
                if (cleanKey === 'contact') details.contact = value.trim();
            }
        });
        return details;
    } catch {
        return { name: contactString, contact: '' };
    }
}

function parseVehicles(vehicleString: string) {
    // Assuming format like "Type: Truck, Rego: ABC123, Insurance: 2024-12-31"
    try {
        return vehicleString.split(';').map(vehicle => {
            const details = { type: '', registration: '', insurance_expiry: '' };
            vehicle.split(',').forEach(item => {
                const [key, value] = item.trim().split(':');
                if (key && value) {
                    const cleanKey = key.trim().toLowerCase();
                    if (cleanKey === 'type') details.type = value.trim();
                    if (cleanKey === 'rego') details.registration = value.trim();
                    if (cleanKey === 'insurance') details.insurance_expiry = value.trim();
                }
            });
            return details;
        });
    } catch {
        return [];
    }
}

function parseInsurancePolicies(insuranceString: string) {
    // Parse insurance policy information
    try {
        return insuranceString.split(';').map(policy => ({
            type: policy.split(',')[0]?.trim() || '',
            provider: policy.split(',')[1]?.trim() || '',
            expiry_date: policy.split(',')[2]?.trim() || '',
            policy_number: policy.split(',')[3]?.trim() || '',
        }));
    } catch {
        return [];
    }
}

function parseDates(dateString: string) {
    // Parse date information
    try {
        const result: Record<string, string> = {};
        dateString.split(',').forEach(item => {
            const [key, date] = item.trim().split(':');
            if (key && date) {
                result[key.trim()] = date.trim();
            }
        });
        return result;
    } catch {
        return {};
    }
}

function parseSuppliers(supplierString: string) {
    // Parse supplier information
    try {
        return supplierString.split(';').map(supplier => ({
            name: supplier.split(',')[0]?.trim() || '',
            contact: supplier.split(',')[1]?.trim() || '',
            services: supplier.split(',')[2]?.trim() || '',
        }));
    } catch {
        return [];
    }
}

function determineCompletedSections(oldData: OldFormData): OnboardingSection[] {
    const completed: OnboardingSection[] = [];

    // Basic section - check if required fields are present
    if (oldData.businessName && oldData.abn && oldData.mainContactName) {
        completed.push('basic');
    }

    // Farm section - check if any farm data exists
    if (oldData.mainFarmingActivities || oldData.cropTypes) {
        completed.push('farm');
    }

    // Financial section - check if financial data exists
    if (oldData.bookkeepingSoftware) {
        completed.push('financial');
    }

    // Compliance section - check if compliance data exists
    if (oldData.insurancePolicies) {
        completed.push('compliance');
    }

    // Storage section - check if storage preferences exist
    if (oldData.cloudStorageDetails) {
        completed.push('storage');
    }

    // Communications section - check if communication preferences exist
    if (oldData.preferredCommunicationMethod) {
        completed.push('communications');
    }

    return completed;
}

/**
 * Validation function to check if old data can be migrated
 */
export function validateOldDataForMigration(oldData: OldFormData) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!oldData.businessName) errors.push('Business name is required');
    if (!oldData.abn) errors.push('ABN is required');
    if (!oldData.mainContactName) errors.push('Main contact name is required');

    // Warnings for data that might not migrate perfectly
    if (!oldData.contactEmailAccounts) warnings.push('Accounts email not provided');
    if (!oldData.contactEmailAdmin) warnings.push('Admin email not provided');

    return {
        canMigrate: errors.length === 0,
        errors,
        warnings,
    };
} 