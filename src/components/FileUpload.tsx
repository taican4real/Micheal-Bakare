import React, { useState, useRef } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, Link as LinkIcon, X, ExternalLink } from 'lucide-react';

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  placeholder?: string;
  helpText?: string;
}

export default function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  folder = 'public/uploads',
  placeholder = 'https://... or upload a file',
  helpText,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Clean filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = Date.now();
      const storagePath = `${folder}/${timestamp}_${safeName}`;
      const fileRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          setUploadError(`Upload failed: ${error.message || 'Check storage permissions'}. You can still paste an external URL below.`);
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadUrl);
            setIsUploading(false);
            setUploadProgress(100);
          } catch (urlErr: any) {
            console.error('Error fetching download URL:', urlErr);
            setUploadError('Failed to get download URL. You can still paste an image link directly.');
            setIsUploading(false);
          }
        }
      );
    } catch (err: any) {
      console.error('Storage initialization error:', err);
      setUploadError(err.message || 'Storage error. Please paste a direct image URL.');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const isImage = value && (
    value.startsWith('http') ||
    value.startsWith('data:image') ||
    value.includes('.png') ||
    value.includes('.jpg') ||
    value.includes('.jpeg') ||
    value.includes('.webp') ||
    value.includes('.gif')
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {helpText && <p className="text-xs text-ink-muted font-light">{helpText}</p>}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-ink bg-zinc-100 scale-[1.01]'
            : 'border-border-subtle hover:border-zinc-400 bg-zinc-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <Loader2 size={32} className="animate-spin text-ink" />
            <div className="w-full max-w-xs bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-ink h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs font-medium text-ink">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-border-subtle text-ink">
              <UploadCloud size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                Click to browse or drag & drop file here
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Uploads to secure cloud storage
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error notification */}
      {uploadError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* URL Input & Preview Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm text-ink"
          />
        </div>
        {value && isImage && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs text-ink-muted hover:text-ink flex items-center gap-1 py-2 px-3 bg-zinc-100 rounded-xl transition-colors"
          >
            Preview <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Image Preview Thumbnail */}
      {value && isImage && (
        <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-zinc-100 max-w-xs aspect-video">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
