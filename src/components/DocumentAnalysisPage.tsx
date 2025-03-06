import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, HelpCircle, FileCheck, Upload, Zap, X, FileSearch } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import DocumentAnalysisContainer from './DocumentAnalysisContainer';
import AIDocumentInsights from './AIDocumentInsights';

// Define the type for uploaded documents
interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
}

const DocumentAnalysisPage: React.FC = () => {
  // Initialize with an empty document to allow access to insights and analysis before upload
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
    {
      id: 'default',
      name: 'Sample Document',
      type: 'text/plain',
      size: 0,
      uploadedAt: new Date()
    }
  ]);
  const [activeView, setActiveView] = useState<'upload' | 'analysis' | 'insights'>('upload');
  const [uploadedText, setUploadedText] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isDocumentInfoModalOpen, setIsDocumentInfoModalOpen] = useState(false);

  const handleDocumentUpload = (ocrText: string, uploadResponse: any) => {
    // Create an UploadedDocument object from the upload response
    const newDocument: UploadedDocument = {
      id: uploadResponse.fileId,
      name: uploadResponse.fileName || 'Uploaded Document',
      type: uploadResponse.fileType || 'unknown',
      size: uploadResponse.fileSize || 0,
      path: uploadResponse.fileUrl,
      uploadedAt: new Date()
    };

    // Replace sample document with the newly uploaded document
    const hasDefaultDocument = uploadedDocuments.some(doc => doc.id === 'default');
    if (hasDefaultDocument) {
      setUploadedDocuments([newDocument]);
    } else {
      // Add to existing documents if no default document exists
      setUploadedDocuments(prevDocuments => [...prevDocuments, newDocument]);
    }

    // Set the OCR text and switch to analysis view
    setUploadedText(ocrText);
    setActiveView('analysis');
  };

  const handleNewUpload = () => {
    setActiveView('upload');
    setUploadedText('');
  };

  const DocumentInfoModal = () => (
    <AnimatePresence>
      {isDocumentInfoModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDocumentInfoModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1C1C1C] 
              rounded-2xl 
              border border-gray-800 
              max-w-2xl 
              w-full 
              p-8 
              relative 
              max-h-[80vh] 
              overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsDocumentInfoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-[#3ECF8E] mb-6 flex items-center">
              <FileText className="mr-4 w-10 h-10" />
              Document Processing Guidelines
            </h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Supported File Formats
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>PDF (Portable Document Format)</li>
                  <li>JPEG/JPG (Image files)</li>
                  <li>PNG (Portable Network Graphics)</li>
                  <li>GIF (Graphics Interchange Format)</li>
                  <li>TIFF (Tagged Image File Format)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  File Size Limitations
                </h3>
                <p>
                  Maximum file size: 10 MB
                  Larger files may cause processing delays or errors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Text Extraction Capabilities
                </h3>
                <p>
                  Our AI can extract text from various document types, 
                  including scanned documents and images with clear text.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const HelpModal = () => (
    <AnimatePresence>
      {isHelpModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsHelpModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1C1C1C] 
              rounded-2xl 
              border border-gray-800 
              max-w-2xl 
              w-full 
              p-8 
              relative 
              max-h-[80vh] 
              overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-[#3ECF8E] mb-6">
              Document Intelligence Guide
            </h2>

            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Supported Document Types
                </h3>
                <p>
                  We support PDF, JPG, PNG, GIF, and TIFF files up to 10MB in size. 
                  Our AI can extract text and analyze document contents intelligently.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  How It Works
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Upload your document</li>
                  <li>Our AI processes the document</li>
                  <li>View detailed insights and analysis</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#3ECF8E] mb-2">
                  Privacy & Security
                </h3>
                <p>
                  All uploaded documents are processed securely and are not stored 
                  permanently. Your data privacy is our top priority.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full space-y-10 relative">
      {/* Help Modal */}
      <HelpModal />
      
      {/* Document Info Modal */}
      <DocumentInfoModal />

      {/* Streamlined Header with Navigation Tabs */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#1C1C1C] 
          rounded-2xl 
          overflow-hidden 
          border border-gray-800 
          transition-all duration-300 
          shadow-lg
          p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] p-3 rounded-xl mr-4">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <motion.h1 
              className="text-3xl font-bold 
                bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] 
                bg-clip-text text-transparent"
            >
              Document Intelligence
            </motion.h1>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsHelpModalOpen(true)}
              className="text-[#3ECF8E] hover:bg-[#3ECF8E]/10 
              p-2 rounded-full 
              transition-all duration-300"
              title="Help and Information"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsDocumentInfoModalOpen(true)}
              className="text-[#3ECF8E] hover:bg-[#3ECF8E]/10 
              p-2 rounded-full 
              transition-all duration-300"
              title="Document Processing Guidelines"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
          <button 
            onClick={() => setActiveView('upload')}
            className={`px-5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2
              ${activeView === 'upload' 
                ? 'bg-[#3ECF8E] text-white' 
                : 'bg-[#1C1C1C] text-gray-300 hover:bg-gray-800'
              }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          
          <button 
            onClick={() => setActiveView('insights')}
            className={`px-5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2
              ${activeView === 'insights' 
                ? 'bg-[#3ECF8E] text-white' 
                : 'bg-[#1C1C1C] text-gray-300 hover:bg-gray-800'
              }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Analysis</span>
          </button>
          
          <button 
            onClick={() => setActiveView('analysis')}
            className={`px-5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2
              ${activeView === 'analysis' 
                ? 'bg-[#3ECF8E] text-white' 
                : 'bg-[#1C1C1C] text-gray-300 hover:bg-gray-800'
              }`}
          >
            <Zap className="w-4 h-4" />
            <span>AI Insights</span>
          </button>
        </div>
      </motion.div>

      {/* Dynamic Content Area - Simplified with consistent styling */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1C1C1C] p-6 rounded-xl border border-gray-800 shadow-md"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'upload' ? (
              <div className="w-full max-w-4xl mx-auto">
                <div className="mb-6 flex items-center">
                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-gradient-to-br
                    from-[#3ECF8E]
                    to-[#7EDCB5]
                    flex
                    items-center
                    justify-center
                    text-white
                    mr-4
                    shadow-md
                    shadow-[#3ECF8E]/20
                  ">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Upload your legal documents for AI-powered analysis and insights
                    </p>
                  </div>
                </div>
                <DocumentUpload 
                  onUpload={(ocrText, uploadResponse) => handleDocumentUpload(ocrText, uploadResponse)} 
                  title="" 
                />
              </div>
            ) : activeView === 'insights' ? (
              <AIDocumentInsights 
                documents={uploadedDocuments}
              />
            ) : (
              <DocumentAnalysisContainer 
                ocrText={uploadedText} 
                onNewUpload={handleNewUpload}
                uploadedDocuments={uploadedDocuments}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DocumentAnalysisPage;
