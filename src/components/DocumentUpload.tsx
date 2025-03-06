import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';
import '../index.css';

// Define interface for upload response
interface UploadResponse {
  fileUrl?: string;
  fileId?: string;
  ocrText?: string;
  complianceResults?: string;
  riskScore?: number;
  error?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

// Define prop types
interface DocumentUploadProps {
  onUpload?: (text: string, uploadResponse: UploadResponse) => void;
  icon?: React.ReactNode;
  title?: string;
}

const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || 'http://backend:8080/upload';
const UPLOAD_TIMEOUT = 120000; // 2 minutes timeout
// const MAX_RETRIES = 3;
// const BASE_RETRY_DELAY = 1000; // 1 second
const MAX_CONCURRENT_UPLOADS = 3; // Limit concurrent uploads

// Singleton upload queue manager
class UploadQueueManager {
  private static instance: UploadQueueManager;
  private activeUploads: number = 0;
  private queue: (() => Promise<void>)[] = [];

  private constructor() {}

  public static getInstance(): UploadQueueManager {
    if (!UploadQueueManager.instance) {
      UploadQueueManager.instance = new UploadQueueManager();
    }
    return UploadQueueManager.instance;
  }

  public async enqueue(uploadFn: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      const wrappedUpload = async () => {
        try {
          await uploadFn();
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          this.activeUploads--;
          this.processQueue();
        }
      };

      if (this.activeUploads < MAX_CONCURRENT_UPLOADS) {
        this.activeUploads++;
        wrappedUpload();
      } else {
        this.queue.push(wrappedUpload);
      }
    });
  }

  private processQueue() {
    while (this.activeUploads < MAX_CONCURRENT_UPLOADS && this.queue.length > 0) {
      const nextUpload = this.queue.shift();
      if (nextUpload) {
        this.activeUploads++;
        nextUpload();
      }
    }
  }
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onUpload, 
  // icon, 
  // title = 'Document OCR Extractor' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadQueueManager = UploadQueueManager.getInstance();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('File change event triggered', files);

    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Validate file size (10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        console.error('File size validation failed', {
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE
        });
        setUploadResponse({
          error: 'File is too large. Maximum file size is 10MB.'
        });
        return;
      }

      // Validate file type
      const ALLOWED_TYPES = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/tiff'
      ];
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error('File type validation failed', {
          fileType: file.type,
          allowedTypes: ALLOWED_TYPES
        });
        setUploadResponse({
          error: 'Invalid file type. Supported types: PDF, JPG, PNG, GIF, TIFF'
        });
        return;
      }

      setSelectedFile(file);
      setUploadResponse({});
    }
  };

  const handleUpload = useCallback(async () => {
    console.log('Upload process started');
    
    if (!selectedFile) {
      console.error('No file selected for upload');
      setUploadResponse({ error: 'Please select a file first' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setUploadResponse({});

    try {
      await uploadQueueManager.enqueue(async () => {
        // Create an AbortController to manage request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn('Upload operation timed out');
          controller.abort();
        }, UPLOAD_TIMEOUT);

        try {
          console.log('Sending upload request', {
            endpoint: UPLOAD_ENDPOINT,
            fileDetails: {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size
            }
          });

          const response = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            body: formData,
            signal: controller.signal
          });

          // Clear the timeout
          clearTimeout(timeoutId);

          console.log('Upload response received', {
            status: response.status,
            statusText: response.statusText
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed', {
              status: response.status,
              errorText: errorText
            });
            
            // Specific handling for 403 Forbidden
            if (response.status === 403) {
              throw new Error('Concurrent upload limit reached. Please wait and try again.');
            }
            
            throw new Error(`Upload failed: ${errorText || response.statusText}`);
          }

          const result = await response.json();
          console.log('Full upload response:', result);
          console.log('Response keys:', Object.keys(result));
          
          // Comprehensive error checking
          if (!result.fileURL) {
            console.error('Missing fileURL in upload response', result);
            setUploadResponse({ 
              error: 'Upload failed: No file URL received' 
            });
            return;
          }

          const uploadResult: UploadResponse = {
            fileUrl: result.fileURL,
            fileId: result.fileID,
            ocrText: result.ocrText || 'No text extracted',
            complianceResults: result.applicable_rules || [], // Use applicable_rules from the new backend response

            // complianceResults: typeof result.complianceResults === 'string' 
            //   ? result.complianceResults 
            //   : JSON.stringify(result.complianceResults, null, 2),
            riskScore: result.riskScore,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size
          };
          console.log('Parsed upload result:', uploadResult);

          setUploadResponse(uploadResult);
          
          // Call onUpload callback if provided
          if (onUpload && uploadResult.ocrText) {
            console.log('Calling onUpload callback');
            onUpload(uploadResult.ocrText, uploadResult);
          }
        } catch (error) {
          // Handle fetch-specific errors
          if (error instanceof DOMException && error.name === 'AbortError') {
            console.error('Upload timed out');
            throw new Error('Upload timed out. Please try again.');
          }
          console.error('Fetch error details:', error);
          throw error;
        }
      });
    } catch (error) {
      console.error('Complete upload error:', error);
      const errorResponse: UploadResponse = { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred during upload' 
      };
      setUploadResponse(errorResponse);

      // Call onUpload with error if needed
      if (onUpload) {
        onUpload('', errorResponse);
      }
    } finally {
      console.log('Upload process completed');
      setIsLoading(false);
    }
  }, [selectedFile, onUpload]);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResponse({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-6 space-y-6 w-full bg-[#1C1C1C] rounded-2xl border border-gray-800 shadow-lg transition-all duration-300">
        {/* Drop Zone */}
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 
            text-center max-w-3xl mx-auto 
            transition-all duration-300 
            ${selectedFile ? 'border-[#3ECF8E]/60 bg-[#3ECF8E]/5' : 'border-gray-700 hover:border-gray-500'}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-5">
            {/* Upload Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] bg-opacity-10 flex items-center justify-center text-white">
              <Upload size={32} className="text-[#3ECF8E]" />
            </div>
            
            {/* File Info */}
            <div className="mt-2">
              <h3 className="text-xl font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Upload your document'}
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                {selectedFile 
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB - ${selectedFile.type}` 
                  : 'Supports PDF, JPG, PNG, GIF, TIFF (max 10MB)'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.tiff"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  aria-label="Upload document"
                  id="file-upload-input"
                />
                <button 
                  className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white py-2 px-6 rounded-lg cursor-pointer relative z-0 transition-all duration-300 border border-gray-700"
                  type="button"
                >
                  Browse Files
                </button>
              </div>
              
              {selectedFile && (
                <div className="relative">
                  <button 
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center relative z-0 bg-red-900/20 hover:bg-red-900/30 py-2 px-4 rounded-lg"
                    type="button"
                    onClick={handleRemoveFile}
                  >
                    <X size={18} className="mr-2" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center relative max-w-3xl mx-auto">
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className={`
              flex items-center space-x-2 px-8 py-3 rounded-lg 
              font-medium text-white 
              transition-all duration-300 
              ${!selectedFile || isLoading 
                ? 'opacity-50 cursor-not-allowed bg-gray-700' 
                : 'bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5] hover:shadow-lg hover:shadow-[#3ECF8E]/20'}
            `}
            type="button"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Processing Document...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload Document</span>
              </>
            )}
          </button>
        </div>

        {uploadResponse.error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center mt-4 flex items-center justify-center space-x-3 max-w-3xl mx-auto">
            <AlertTriangle className="text-red-400" size={20} />
            <span className="text-red-300">{uploadResponse.error}</span>
          </div>
        )}

        {uploadResponse.ocrText && (
          <div className="
            mt-6 
            p-6 
            bg-[#2C2C2C] 
            border 
            border-gray-700 
            rounded-2xl 
            shadow-lg 
            transition-all 
            hover:border-[#3ECF8E]/30
            max-w-4xl
            mx-auto
          ">
            <div className="flex items-center space-x-4 mb-5">
              <div className="
                w-12 
                h-12 
                rounded-xl 
                bg-gradient-to-br 
                from-[#3ECF8E] 
                to-[#7EDCB5] 
                flex 
                items-center 
                justify-center 
                text-white
                shadow-lg
                shadow-[#3ECF8E]/20
              ">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Extracted Document Text
              </h3>
            </div>
            
            <div className="
              bg-[#1C1C1C] 
              border 
              border-gray-700 
              rounded-lg 
              p-5 
              max-h-80 
              overflow-y-auto 
              text-gray-300 
              leading-relaxed 
              tracking-wide
              scrollbar-thin
              scrollbar-thumb-gray-700
              scrollbar-track-[#1C1C1C]
            ">
              <p className="whitespace-pre-wrap break-words">
                {uploadResponse.ocrText}
              </p>
            </div>

            {uploadResponse.complianceResults && (
              <div className="mt-5 bg-[#1C1C1C] border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#3ECF8E] mb-2">
                  Compliance Results
                </h3>
                <pre className="text-gray-300 whitespace-pre-wrap overflow-auto max-h-[300px] text-sm
                  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#1C1C1C]">
                  {uploadResponse.complianceResults}
                </pre>
              </div>
            )}

            {uploadResponse.riskScore !== undefined && (
              <div className="mt-4 bg-[#1C1C1C] border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-[#3ECF8E] mb-2">
                  Risk Score
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5] h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, uploadResponse.riskScore)}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-white font-medium">{uploadResponse.riskScore}%</span>
                </div>
              </div>
            )}

            {uploadResponse.fileUrl && (
              <div className="mt-5 flex justify-end">
                <a 
                  href={uploadResponse.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="
                    inline-flex 
                    items-center 
                    space-x-2 
                    px-5 
                    py-2 
                    bg-gradient-to-r 
                    from-[#3ECF8E]/20 
                    to-[#7EDCB5]/20 
                    text-white 
                    rounded-lg 
                    hover:from-[#3ECF8E]/30 
                    hover:to-[#7EDCB5]/30 
                    transition-all
                    border
                    border-[#3ECF8E]/30
                    shadow-sm
                    hover:shadow-[#3ECF8E]/20
                  "
                >
                  <FileText size={16} />
                  <span>View Original Document</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;