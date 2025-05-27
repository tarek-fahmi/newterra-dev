import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DocumentType, OnboardingDocument } from '../../types/database';

interface DocumentUploadProps {
    docType: DocumentType;
    label: string;
    description?: string;
    required?: boolean;
    accept?: string;
    maxSize?: number; // in MB
    existingDocument?: OnboardingDocument;
    onUpload: (file: File, docType: DocumentType) => Promise<void>;
    onDelete?: (documentId: string) => Promise<void>;
    loading?: boolean;
}

export function DocumentUpload({
    docType,
    label,
    description,
    required = false,
    accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
    maxSize = 10,
    existingDocument,
    onUpload,
    onDelete,
    loading = false
}: DocumentUploadProps) {
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        setError(null);

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = accept.split(',').map(type => type.trim());
        if (!acceptedTypes.includes(fileExtension)) {
            setError(`File type not supported. Accepted types: ${accept}`);
            return;
        }

        handleUpload(file);
    };

    const handleUpload = async (file: File) => {
        try {
            setUploadProgress(0);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            await onUpload(file, docType);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Reset progress after a delay
            setTimeout(() => setUploadProgress(0), 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setUploadProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDelete = async () => {
        if (existingDocument && onDelete) {
            try {
                await onDelete(existingDocument.id);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Delete failed');
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
            return '🖼️';
        }
        if (['pdf'].includes(extension || '')) {
            return '📄';
        }
        if (['doc', 'docx'].includes(extension || '')) {
            return '📝';
        }
        return '📎';
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-sm">{label}</h3>
                        {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    {existingDocument && (
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-green-600">Uploaded</span>
                        </div>
                    )}
                </div>

                {description && (
                    <p className="text-xs text-gray-500 mb-3">{description}</p>
                )}

                {existingDocument ? (
                    // Show existing document
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">{getFileIcon(existingDocument.file_url)}</span>
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    {existingDocument.file_url.split('/').pop()}
                                </p>
                                <p className="text-xs text-green-600">
                                    Uploaded {new Date(existingDocument.uploaded_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(existingDocument.file_url, '_blank')}
                            >
                                View
                            </Button>
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Show upload area
                    <div>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                Drop your file here, or <span className="text-blue-600 underline">browse</span>
                            </p>
                            <p className="text-xs text-gray-400">
                                Supports: {accept} (max {maxSize}MB)
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleFileInputChange}
                            className="hidden"
                            disabled={loading}
                        />

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Uploading...</span>
                                    <span className="text-xs text-gray-600">{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                            </div>
                        )}

                        {error && (
                            <div className="mt-3 flex items-center space-x-2 text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-xs">{error}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 