import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { Zap, FileText } from 'lucide-react';
import AIInsights from './AIInsights';

// // Define the type for uploaded documents
// interface UploadedDocument {
//   id?: string;
//   name: string;
//   type: string;
//   size: number;
//   path?: string;
//   uploadedAt?: Date;
//   complianceStatus?: string;
// }

interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
  complianceStatus?: string;
  complianceResults?: string[]; // Change to string array for applicable rules
}

// Define prop types for DocumentAnalysisContainer
interface DocumentAnalysisContainerProps {
  ocrText: string;
  onNewUpload: () => void;
  uploadedDocuments: UploadedDocument[];
}

// // Compliance color utility function
// const getComplianceColor = (status: string): string => {
//   switch(status?.toLowerCase()) {
//     case 'pass': return 'text-green-500 bg-green-900 bg-opacity-20';
//     case 'fail': return 'text-red-500 bg-red-900 bg-opacity-20';
//     case 'warning': return 'text-yellow-500 bg-yellow-900 bg-opacity-20';
//     default: return 'text-gray-500 bg-gray-900 bg-opacity-20';
//   }
// };

// const appleScrollVariants = {
//   hidden: { 
//     opacity: 0, 
//     y: 50,
//     scale: 0.98
//   },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 50,
//       damping: 15,
//       duration: 0.8
//     }
//   },
//   exit: { 
//     opacity: 0.3, 
//     y: 20,
//     scale: 0.98,
//     transition: {
//       type: "spring",
//       stiffness: 50,
//       damping: 15,
//       duration: 0.8
//     }
//   }
// };

// const itemVariants = {
//   hidden: { 
//     opacity: 0, 
//     y: 50,
//     scale: 0.98
//   },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     scale: 1,
//     transition: {
//       type: "spring",
//       stiffness: 50,
//       damping: 15,
//       duration: 0.8
//     }
//   },
//   exit: { 
//     opacity: 0.3, 
//     y: 20,
//     scale: 0.98,
//     transition: {
//       type: "spring",
//       stiffness: 50,
//       damping: 15,
//       duration: 0.8
//     }
//   }
// };

const DocumentAnalysisContainer: React.FC<DocumentAnalysisContainerProps> = ({ 
  ocrText, 
  // onNewUpload, 
  uploadedDocuments 
}) => {
  const [documentText, setDocumentText] = useState(ocrText);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);

  // Update documentText when ocrText prop changes
  useEffect(() => {
    setDocumentText(ocrText);
  }, [ocrText]);

  // Handle document navigation
  const navigateToNextDocument = () => {
    if (selectedDocumentIndex < uploadedDocuments.length - 1) {
      setSelectedDocumentIndex(prev => prev + 1);
    }
  };

  const navigateToPreviousDocument = () => {
    if (selectedDocumentIndex > 0) {
      setSelectedDocumentIndex(prev => prev - 1);
    }
  };

  // Get the currently selected document
  const currentDocument = uploadedDocuments[selectedDocumentIndex];

  return (
    <div className="w-full">
      {/* Document selector if multiple documents - Enhanced */}
      {uploadedDocuments.length > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-[#2C2C2C] p-4 rounded-lg border border-gray-800 shadow-sm">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3ECF8E]/20 to-[#7EDCB5]/20 flex items-center justify-center mr-3 border border-[#3ECF8E]/30">
              <FileText className="w-4 h-4 text-[#3ECF8E]" />
            </div>
            <div className="text-sm text-white">
              Document <span className="font-medium">{selectedDocumentIndex + 1}</span> of <span className="font-medium">{uploadedDocuments.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              value={selectedDocumentIndex}
              onChange={(e) => setSelectedDocumentIndex(parseInt(e.target.value))}
              className="bg-[#1C1C1C] text-white border border-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] mr-2"
            >
              {uploadedDocuments.map((doc, index) => (
                <option key={index} value={index}>{doc.name}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={navigateToPreviousDocument}
                disabled={selectedDocumentIndex === 0}
                className={`p-2 rounded-md transition-colors ${selectedDocumentIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-[#1C1C1C] hover:text-[#3ECF8E]'}`}
                title="Previous Document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <button 
                onClick={navigateToNextDocument}
                disabled={selectedDocumentIndex >= uploadedDocuments.length - 1}
                className={`p-2 rounded-md transition-colors ${selectedDocumentIndex >= uploadedDocuments.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-[#1C1C1C] hover:text-[#3ECF8E]'}`}
                title="Next Document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Analysis Content */}
      <div className="space-y-6">
        {/* Document Info - Enhanced with more context */}
        {currentDocument && (
          <div className="flex flex-col mb-6 bg-[#2C2C2C] p-6 rounded-lg border border-gray-800 shadow-sm hover:border-[#3ECF8E]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3ECF8E]/20 to-[#7EDCB5]/20 flex items-center justify-center mr-4 border border-[#3ECF8E]/30 shadow-sm">
                  <FileText className="w-6 h-6 text-[#3ECF8E]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{currentDocument.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentDocument.type} • {(currentDocument.size / 1024).toFixed(2)} KB • 
                    {currentDocument.uploadedAt && `Uploaded ${currentDocument.uploadedAt.toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs px-3 py-1.5 rounded-full bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20">
                  {currentDocument.id === 'default' ? 'Sample Document' : 'Document Ready for Analysis'}
                </div>
              </div>
            </div>
            
            {/* Document metadata and context */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-[#1C1C1C] p-3 rounded-md border border-gray-800">
                <h5 className="text-xs font-medium text-[#3ECF8E] mb-1">Document Type</h5>
                <p className="text-sm text-white">
                  {currentDocument.type === 'application/pdf' ? 'PDF Document' : 
                   currentDocument.type.includes('image') ? 'Image Document' : 
                   'Text Document'}
                </p>
              </div>
              
              <div className="bg-[#1C1C1C] p-3 rounded-md border border-gray-800">
                <h5 className="text-xs font-medium text-[#3ECF8E] mb-1">Processing Status</h5>
                <p className="text-sm text-white flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#3ECF8E] mr-2"></span>
                  {currentDocument.id === 'default' ? 'Sample Document (Pre-processed)' : 'Successfully Processed'}
                </p>
              </div>
              
              <div className="bg-[#1C1C1C] p-3 rounded-md border border-gray-800">
                <h5 className="text-xs font-medium text-[#3ECF8E] mb-1">Content Length</h5>
                <p className="text-sm text-white">
                  {documentText ? `${documentText.length.toLocaleString()} characters` : 'Processing...'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Insights Section - Enhanced */}
        <div className="bg-[#2C2C2C] rounded-xl p-6 border border-gray-800 transition-all duration-300 hover:border-[#3ECF8E]/30 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] flex items-center justify-center text-white mr-4 shadow-md shadow-[#3ECF8E]/20">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Document Insights</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Powered by advanced language models for comprehensive legal analysis
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400">
              <div className="flex items-center px-3 py-1.5 bg-[#1C1C1C] rounded-md border border-gray-800">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Groq LLM</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-[#1C1C1C] rounded-md border border-gray-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span>Llama 3 70B</span>
              </div>
            </div>
          </div>
          
          <AIInsights 
            documentText={documentText}
            title=""
            icon={null}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysisContainer;
