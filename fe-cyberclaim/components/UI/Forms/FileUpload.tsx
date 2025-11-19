// components/UI/Forms/FileUpload.tsx
'use client';

import { useRef, useState, useCallback } from 'react';
import { DocumentIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  name: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  error?: string;
  disabled?: boolean;
}

export function FileUpload({
  name,
  value,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.zip,.rar',
  maxSize = 10, // 10MB default
  error,
  disabled = false
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File terlalu besar. Maksimal ${maxSize}MB`);
      return;
    }

    // Check file type
    const acceptedTypes = accept.split(',');
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      alert(`Tipe file tidak didukung. Gunakan: ${accept}`);
      return;
    }

    onChange(file);
  }, [accept, maxSize, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <CloudArrowUpIcon className={`mx-auto h-8 w-8 ${
            dragActive ? 'text-blue-500' : error ? 'text-red-400' : 'text-gray-400'
          }`} />
          
          <div className="space-y-1">
            <p className={`text-sm font-medium ${
              dragActive ? 'text-blue-600' : error ? 'text-red-600' : 'text-gray-600'
            }`}>
              {value ? 'File terpilih' : 'Klik untuk upload atau drag file ke sini'}
            </p>
            <p className="text-xs text-gray-500">
              Support: {accept} (Maksimal: {maxSize}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Preview */}
      {value && (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="h-8 w-8 text-blue-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={removeFile}
            disabled={disabled}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}