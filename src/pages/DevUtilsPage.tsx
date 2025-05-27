import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkSupabaseConfiguration, quickHealthCheck, getConfigSummary } from '../lib/supabase-config-check';
import { runIntegrationTest, runSmokeTest } from '../utils/integration-test';
import { AlertTriangle, CheckCircle, Info, Play, Database } from 'lucide-react';

interface TestResult {
    status: 'success' | 'warning' | 'error';
    message: string;
    details?: unknown;
}

export default function DevUtilsPage() {
    const [configCheck, setConfigCheck] = useState<any>(null);
    const [healthCheck, setHealthCheck] = useState<TestResult | null>(null);
    const [integrationTest, setIntegrationTest] = useState<any>(null);
    const [smokeTest, setSmokeTest] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const setLoadingState = (key: string, isLoading: boolean) => {
        setLoading(prev => ({ ...prev, [key]: isLoading }));
    };

    const handleConfigCheck = async () => {
        setLoadingState('config', true);
        try {
            const result = await checkSupabaseConfiguration();
            setConfigCheck(result);
        } catch (error) {
            setConfigCheck({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
        setLoadingState('config', false);
    };

    const handleHealthCheck = async () => {
        setLoadingState('health', true);
        try {
            const result = await quickHealthCheck();
            setHealthCheck({
                status: result.healthy ? 'success' : 'error',
                message: result.message
            });
        } catch (error) {
            setHealthCheck({
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        setLoadingState('health', false);
    };

    const handleSmokeTest = async () => {
        setLoadingState('smoke', true);
        try {
            const result = await runSmokeTest();
            setSmokeTest({
                status: result.success ? 'success' : 'error',
                message: result.message
            });
        } catch (error) {
            setSmokeTest({
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        setLoadingState('smoke', false);
    };

    const handleIntegrationTest = async () => {
        setLoadingState('integration', true);
        try {
            // Use a test user ID (you can modify this)
            const testUserId = '5ea00f94-c220-4a97-85fc-00b309dbdfab'; // From existing profiles
            const result = await runIntegrationTest(testUserId);
            setIntegrationTest(result);
        } catch (error) {
            setIntegrationTest({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        setLoadingState('integration', false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const configSummary = getConfigSummary();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Development Utilities</h1>
                <p className="text-gray-600">
                    Testing and verification tools for the onboarding system integration
                </p>
            </div>

            {/* Configuration Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Configuration Summary
                    </CardTitle>
                    <CardDescription>
                        Current Supabase configuration details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Supabase URL:</p>
                            <p className="text-sm text-gray-600 font-mono">{configSummary.supabase_url}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Has Anon Key:</p>
                            <Badge className={configSummary.has_anon_key ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {configSummary.has_anon_key ? 'Yes' : 'No'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Client Initialized:</p>
                            <Badge className={configSummary.client_initialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {configSummary.client_initialized ? 'Yes' : 'No'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Environment:</p>
                            <Badge className="bg-blue-100 text-blue-800">
                                {configSummary.environment}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                    onClick={handleHealthCheck}
                    disabled={loading.health}
                    className="h-20 flex flex-col items-center gap-2"
                >
                    <Play className="h-5 w-5" />
                    {loading.health ? 'Checking...' : 'Health Check'}
                </Button>

                <Button
                    onClick={handleConfigCheck}
                    disabled={loading.config}
                    className="h-20 flex flex-col items-center gap-2"
                >
                    <Database className="h-5 w-5" />
                    {loading.config ? 'Checking...' : 'Config Check'}
                </Button>

                <Button
                    onClick={handleSmokeTest}
                    disabled={loading.smoke}
                    className="h-20 flex flex-col items-center gap-2"
                >
                    <AlertTriangle className="h-5 w-5" />
                    {loading.smoke ? 'Testing...' : 'Smoke Test'}
                </Button>

                <Button
                    onClick={handleIntegrationTest}
                    disabled={loading.integration}
                    className="h-20 flex flex-col items-center gap-2"
                >
                    <CheckCircle className="h-5 w-5" />
                    {loading.integration ? 'Testing...' : 'Integration Test'}
                </Button>
            </div>

            {/* Test Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Health Check Results */}
                {healthCheck && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(healthCheck.status)}
                                Health Check
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertDescription>
                                    {healthCheck.message}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

                {/* Smoke Test Results */}
                {smokeTest && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(smokeTest.status)}
                                Smoke Test
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertDescription>
                                    {smokeTest.message}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

                {/* Configuration Check Results */}
                {configCheck && (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Configuration Check Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {configCheck.error ? (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Error: {configCheck.error}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(configCheck).map(([key, result]: [string, any]) => (
                                        <div key={key} className="flex items-center justify-between p-3 border rounded">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(result.status)}
                                                <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={getStatusColor(result.status)}>
                                                    {result.status.toUpperCase()}
                                                </Badge>
                                                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Integration Test Results */}
                {integrationTest && (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Integration Test Results</CardTitle>
                            {integrationTest.passed !== undefined && (
                                <CardDescription>
                                    {integrationTest.passed} passed, {integrationTest.failed} failed
                                    {' '}({Math.round((integrationTest.passed / (integrationTest.passed + integrationTest.failed)) * 100)}% success rate)
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {integrationTest.error ? (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Error: {integrationTest.error}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {integrationTest.results?.map((result: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                                            <div className="flex items-center gap-2">
                                                {result.status === 'PASS' ?
                                                    <CheckCircle className="h-4 w-4 text-green-500" /> :
                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                }
                                                <span className="font-medium">{result.test.replace('_', ' ')}</span>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={result.status === 'PASS' ?
                                                    'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                    {result.status}
                                                </Badge>
                                                <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    This page is for development and testing purposes only.
                    It should not be accessible in production environments.
                </AlertDescription>
            </Alert>
        </div>
    );
} 