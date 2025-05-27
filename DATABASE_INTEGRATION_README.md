# NewTerra Database Schema Integration

This document outlines the integration of the new business onboarding database schema into the NewTerra React application.

## Overview

The codebase has been updated to support a comprehensive business onboarding system with the following key features:

- **Multi-step onboarding process** with 6 sections: Basic, Farm, Financial, Compliance, Storage, Communications
- **Document management** with upload, storage, and validation
- **Agreement signing** with digital signatures and audit trail
- **Progress tracking** with save & resume functionality
- **Form validation** and data persistence

## Database Schema

### Core Tables

1. **business_profiles** - Main business entity
2. **addresses** - Business addresses (postal, property)
3. **business_onboarding_sections** - Section-specific form data
4. **onboarding_documents** - Uploaded documents
5. **signed_agreements** - Legal agreements with signatures
6. **onboarding_progress** - Progress tracking
7. **mandatory_documents** - Requirements checklist

### Enums

- `onboarding_section`: basic, farm, financial, compliance, storage, communications
- `document_type`: Various document types (ABN cert, licenses, policies, etc.)
- `agreement_type`: service_agreement, privacy_consent, direct_debit, terms_and_conditions

## Code Structure

### Type Definitions

**Location**: `src/types/database.ts`

Comprehensive TypeScript interfaces for all database entities and form data structures.

### API Layer

**Location**: `src/lib/api.ts`

Service functions organized by entity:
- `businessProfileApi` - Business profile CRUD operations
- `addressApi` - Address management
- `onboardingSectionApi` - Section data management
- `documentApi` - Document upload/management
- `agreementApi` - Agreement signing
- `progressApi` - Progress tracking
- `mandatoryDocumentApi` - Requirements lookup
- `onboardingUtils` - Utility functions

### React Hooks

**Business Profile Hook**: `src/hooks/useBusinessProfile.ts`
- Manages business profile state
- CRUD operations
- Onboarding completion

**Onboarding Hook**: `src/hooks/useOnboarding.ts`
- Multi-section form management
- Document upload/management
- Agreement signing
- Progress tracking

**Authentication Hook**: `src/hooks/useAuth.ts`
- Supabase authentication integration
- User session management

### Context Providers

**Business Profile Context**: `src/context/BusinessProfileContext.tsx`
- Global state management
- Combines business profile and onboarding hooks
- Provides unified interface across components

### Components

**New Onboarding Page**: `src/pages/OnboardingPage.tsx`
- Modern multi-step form interface
- Real-time progress tracking
- Document upload integration
- Agreement signing workflow

**Document Upload Component**: `src/components/onboarding/DocumentUpload.tsx`
- Drag & drop file upload
- File validation
- Progress indicators
- Document management

## Usage Guide

### Setting Up

1. **Database Setup**: Apply the SQL schema to your Supabase database
2. **Storage Setup**: Create a `documents` storage bucket in Supabase
3. **Environment**: Ensure SUPABASE_URL and SUPABASE_ANON_KEY are configured

### Using the New Onboarding System

```typescript
// Access business profile and onboarding state
import { useBusinessProfileContext } from '@/context/BusinessProfileContext';

function MyComponent() {
  const {
    businessProfile,
    currentSection,
    saveSectionData,
    uploadDocument,
    completeSection
  } = useBusinessProfileContext();

  // Save form data for current section
  const handleSave = async (formData) => {
    await saveSectionData(currentSection, formData);
  };

  // Upload a document
  const handleFileUpload = async (file, docType) => {
    await uploadDocument(file, docType, currentSection);
  };

  // Complete current section and move to next
  const handleComplete = async () => {
    await completeSection(currentSection);
  };
}
```

### Creating Custom Section Components

```typescript
import { OnboardingSection, DocumentType } from '@/types/database';
import { DocumentUpload } from '@/components/onboarding/DocumentUpload';

function CustomSection() {
  const { 
    saveSectionData, 
    uploadDocument, 
    getDocumentsForSection 
  } = useBusinessProfileContext();

  const sectionDocuments = getDocumentsForSection('compliance');

  return (
    <div>
      {/* Form fields */}
      
      {/* Document uploads */}
      <DocumentUpload
        docType="public_liability_policy"
        label="Public Liability Insurance"
        required={true}
        existingDocument={sectionDocuments.find(d => d.doc_type === 'public_liability_policy')}
        onUpload={uploadDocument}
      />
    </div>
  );
}
```

## API Functions Reference

### Business Profile Operations

```typescript
// Create new business profile
const profile = await businessProfileApi.create(profileData);

// Get profile by user ID
const profile = await businessProfileApi.getByUserId(userId);

// Update profile
const updated = await businessProfileApi.update(profileId, updates);

// Mark onboarding complete
const completed = await businessProfileApi.markOnboardingComplete(profileId);
```

### Document Management

```typescript
// Upload file to storage and create document record
const document = await documentApi.upload({
  business_profile_id: profileId,
  section_name: 'basic',
  doc_type: 'abn_certificate',
  file_url: fileUrl
});

// Get documents for a section
const docs = await documentApi.getBySection(profileId, 'compliance');

// Delete document
await documentApi.delete(documentId);
```

### Progress Tracking

```typescript
// Get current progress
const progress = await progressApi.get(profileId);

// Mark section complete
const updated = await progressApi.markStepComplete(profileId, 'basic');

// Check overall status
const status = await onboardingUtils.getOnboardingStatus(profileId);
```

## Validation Rules

### Document Requirements

Documents are validated based on the `mandatory_documents` table:
- **Basic section**: ABN certificate (required), ACN certificate (if ACN provided), GST notice (if GST registered)
- **Farm section**: Chemical handling license (if chemicals used), water license (if applicable)
- **Compliance section**: Public liability policy (required), workers comp (if employees), vehicle insurance (if vehicles)

### Form Validation

Each section has Zod schemas for client-side validation:
- ABN: 11-digit format validation
- Email: Valid email format
- Phone: Required format validation
- File uploads: Size and type restrictions

## Security Considerations

### Row Level Security (RLS)

Ensure RLS policies are enabled on all tables:

```sql
-- Example policy for business_profiles
CREATE POLICY "Users can only access their own business profiles" 
ON business_profiles FOR ALL 
USING (user_id = auth.uid());
```

### File Upload Security

- File type validation on client and server
- File size limits (default 10MB)
- Virus scanning (recommended for production)
- Storage bucket access controls

## Migration from Old System

If migrating from the previous onboarding system:

1. **Data Migration**: Map existing form data to new section structure
2. **Document Migration**: Move uploaded files to new storage structure
3. **Progress Migration**: Convert completion status to new progress format
4. **Route Updates**: Update navigation to use new onboarding routes

## Testing

### Unit Tests

Test the API functions and hooks:

```typescript
// Test business profile creation
test('creates business profile', async () => {
  const profile = await businessProfileApi.create(testData);
  expect(profile.id).toBeDefined();
});

// Test document upload
test('uploads document', async () => {
  const doc = await documentApi.upload(testDocData);
  expect(doc.file_url).toBeDefined();
});
```

### Integration Tests

Test the complete onboarding flow:
- Form submission and data persistence
- Document upload and retrieval
- Progress tracking
- Section completion workflow

## Performance Considerations

- **Lazy Loading**: Section data is loaded on demand
- **Caching**: Use React Query or SWR for API caching
- **Optimistic Updates**: Update UI before API confirmation
- **File Compression**: Compress images before upload

## Troubleshooting

### Common Issues

1. **File Upload Fails**: Check storage bucket permissions and CORS settings
2. **Form Data Not Persisting**: Verify business profile exists before saving sections
3. **Progress Not Updating**: Ensure section requirements are met before completion
4. **Type Errors**: Check that database schema matches TypeScript interfaces

### Debug Tools

Use the browser dev tools to inspect:
- Network requests for API calls
- Local storage for cached data
- Console logs for error messages
- React DevTools for component state

## Future Enhancements

Potential improvements:
- **Real-time Sync**: WebSocket updates for multi-user editing
- **Advanced Validation**: Server-side business rule validation
- **Audit Trail**: Detailed change tracking
- **Bulk Operations**: Mass document upload/management
- **Integration APIs**: Third-party service connections (accounting software, government databases)

## Support

For technical support or questions about the integration:
1. Check this documentation first
2. Review the TypeScript interfaces for data structures
3. Examine the API functions for usage examples
4. Test with the new onboarding page (`/onboarding-new`)

---

This integration provides a robust foundation for business onboarding with room for future enhancements and customization. 