import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useOnboarding } from "../hooks/useOnboarding";
import { useAuth } from "../hooks/useAuth";
import { OnboardingSection, AgreementType } from "../types/database";

// Validation schemas for each section
const basicSchema = z.object({
    full_name: z.string().min(1, "Business name is required"),
    trading_name: z.string().min(1, "Trading name is required"),
    abn: z.string().regex(/^\d{11}$/, "ABN must be 11 digits"),
    acn: z.string().optional(),
    gst_registered: z.boolean(),
    main_contact: z.object({
        name: z.string().min(1, "Contact name is required"),
        title: z.string().min(1, "Contact title is required"),
    }),
    contact_emails: z.object({
        accounts: z.string().email("Valid email required"),
        admin: z.string().email("Valid email required"),
        personal: z.string().email().optional(),
    }),
    contact_phones: z.object({
        primary: z.string().min(1, "Primary phone is required"),
        secondary: z.string().optional(),
        mobile: z.string().optional(),
    }),
    business_structure: z.string().min(1, "Business structure is required"),
});

const sections = [
    { key: "basic" as OnboardingSection, label: "Basic Information", icon: "🏢" },
    { key: "farm" as OnboardingSection, label: "Farm Information", icon: "🌾" },
    { key: "financial" as OnboardingSection, label: "Financial Details", icon: "💰" },
    { key: "compliance" as OnboardingSection, label: "Compliance", icon: "📋" },
    { key: "storage" as OnboardingSection, label: "Storage & Access", icon: "💾" },
    { key: "communications" as OnboardingSection, label: "Communications", icon: "📞" },
];

export function OnboardingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { businessProfile, createBusinessProfile, loading: profileLoading } = useBusinessProfile();
    const {
        currentSection,
        progress,
        sectionData,
        loading: onboardingLoading,
        saveSectionData,
        completeSection,
        signAgreement,
        navigateToSection,
        isSectionComplete,
        isAgreementSigned,
        getNextSection,
        getPreviousSection,
    } = useOnboarding();

    const form = useForm({
        resolver: zodResolver(basicSchema),
        defaultValues: {
            full_name: "",
            trading_name: "",
            abn: "",
            acn: "",
            gst_registered: false,
            main_contact: { name: "", title: "" },
            contact_emails: { accounts: "", admin: "", personal: "" },
            contact_phones: { primary: "", secondary: "", mobile: "" },
            business_structure: "",
        },
    });

    // Load section data into form when switching sections
    useEffect(() => {
        if (currentSection === 'basic' && sectionData.basic) {
            form.reset(sectionData.basic);
        }
    }, [currentSection, sectionData, form]);

    const onSubmit = async (data: z.infer<typeof basicSchema>) => {
        try {
            if (currentSection === 'basic') {
                // If no business profile exists, create one
                if (!businessProfile) {
                    await createBusinessProfile({
                        full_name: data.full_name,
                        trading_name: data.trading_name,
                        abn: data.abn,
                        acn: data.acn,
                        gst_registered: data.gst_registered,
                        main_contact: data.main_contact,
                        contact_emails: data.contact_emails,
                        contact_phones: data.contact_phones,
                        business_structure: data.business_structure,
                    });
                }
            }

            // Save section data
            await saveSectionData(currentSection, data);

            // Complete the section
            await completeSection(currentSection);

            // Navigate to next section or complete onboarding
            const nextSection = getNextSection();
            if (nextSection) {
                navigateToSection(nextSection);
            } else {
                // All sections complete, redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error saving section:', error);
        }
    };

    const handleAgreementSign = async (agreementType: AgreementType) => {
        if (!user) return;
        try {
            await signAgreement(agreementType, user.id);
        } catch (error) {
            console.error('Error signing agreement:', error);
        }
    };

    const getProgressPercentage = () => {
        const completedSteps = progress?.completed_steps.length || 0;
        return (completedSteps / sections.length) * 100;
    };

    const renderBasicSection = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Business Name *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Registered business name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="trading_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trading Name *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Trading name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="abn"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ABN *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="11 digit ABN" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="acn"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ACN</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="ACN (if applicable)" />
                            </FormControl>
                            <FormDescription>Only required for companies</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="gst_registered"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>GST Registered</FormLabel>
                            <FormDescription>
                                Check if your business is registered for GST
                            </FormDescription>
                        </div>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="main_contact.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Main Contact Name *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Contact person name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="main_contact.title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Title *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Job title or role" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="contact_emails.accounts"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Accounts Email *</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="accounts@company.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact_emails.admin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin Email *</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="admin@company.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="business_structure"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business Structure *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select business structure" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="sole_trader">Sole Trader</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="company">Company</SelectItem>
                                <SelectItem value="trust">Trust</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );

    const renderOtherSections = () => (
        <div className="space-y-6">
            <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                    This section is under development. Please continue to the next section.
                </p>
            </div>
        </div>
    );

    if (profileLoading || onboardingLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading onboarding...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar>
                    <SidebarContent>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Onboarding Progress</h2>
                            <Progress value={getProgressPercentage()} className="mb-6" />
                        </div>
                        <SidebarMenu>
                            {sections.map((section) => {
                                const isComplete = isSectionComplete(section.key);
                                const isCurrent = currentSection === section.key;

                                return (
                                    <SidebarMenuItem key={section.key}>
                                        <button
                                            onClick={() => navigateToSection(section.key)}
                                            className={`w-full text-left p-3 rounded flex items-center space-x-3 ${isCurrent
                                                ? 'bg-blue-100 text-blue-700'
                                                : isComplete
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-lg">{section.icon}</span>
                                            <span className="flex-1">{section.label}</span>
                                            {isComplete && <CheckCircle className="h-4 w-4 text-green-500" />}
                                        </button>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>

                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Business Onboarding</h1>
                            <p className="text-gray-600">
                                Complete your business profile to get started with NewTerra
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {currentSection === 'basic' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Basic Information</CardTitle>
                                            <CardDescription>
                                                Tell us about your business structure and key contacts
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {renderBasicSection()}
                                        </CardContent>
                                    </Card>
                                )}

                                {(currentSection === 'farm' || currentSection === 'financial' || currentSection === 'compliance' || currentSection === 'communications') && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {sections.find(s => s.key === currentSection)?.label}
                                            </CardTitle>
                                            <CardDescription>
                                                This section is currently under development
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {renderOtherSections()}
                                        </CardContent>
                                    </Card>
                                )}

                                {currentSection === 'storage' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Service Agreement & Consent</CardTitle>
                                            <CardDescription>
                                                Please review and sign the required agreements
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 border rounded">
                                                    <div>
                                                        <h4 className="font-medium">Service Agreement</h4>
                                                        <p className="text-sm text-gray-600">Terms of service for NewTerra platform</p>
                                                    </div>
                                                    {isAgreementSigned('service_agreement') ? (
                                                        <Badge className="bg-green-100 text-green-800">Signed</Badge>
                                                    ) : (
                                                        <Button onClick={() => handleAgreementSign('service_agreement')}>
                                                            Sign Agreement
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between p-4 border rounded">
                                                    <div>
                                                        <h4 className="font-medium">Privacy Consent</h4>
                                                        <p className="text-sm text-gray-600">Data privacy and handling consent</p>
                                                    </div>
                                                    {isAgreementSigned('privacy_consent') ? (
                                                        <Badge className="bg-green-100 text-green-800">Signed</Badge>
                                                    ) : (
                                                        <Button onClick={() => handleAgreementSign('privacy_consent')}>
                                                            Give Consent
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const prevSection = getPreviousSection();
                                            if (prevSection) navigateToSection(prevSection);
                                        }}
                                        disabled={!getPreviousSection()}
                                    >
                                        Previous
                                    </Button>

                                    <Button type="submit">
                                        {getNextSection() ? 'Save & Continue' : 'Complete Onboarding'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}

export default OnboardingPage;