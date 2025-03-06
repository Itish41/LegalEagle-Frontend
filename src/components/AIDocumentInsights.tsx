import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  FileSearch, 
  Download, 
  BarChart2 
} from 'lucide-react';

// Define the type for uploaded documents to match DocumentAnalysisPage
interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  uploadedAt?: Date;
}

interface AIDocumentInsightsProps {
  documents: UploadedDocument[];
}

const AIDocumentInsights: React.FC<AIDocumentInsightsProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  // const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  // Use useState and useEffect to ensure consistent values across renders
  const [documentInsights, setDocumentInsights] = useState<any[]>([]);
  
  // Generate insights only once when documents change
  useEffect(() => {
    // Check if we already have insights for these documents
    const documentsKey = documents.map(doc => doc.id).join('-');
    const cachedInsightsKey = `document_insights_${documentsKey}`;
    const cachedInsights = localStorage.getItem(cachedInsightsKey);
    
    if (cachedInsights) {
      // Use cached insights if available, ensuring dates are properly converted
      const parsedInsights = JSON.parse(cachedInsights).map((insight: any) => ({
        ...insight,
        uploadedAt: insight.uploadedAt ? new Date(insight.uploadedAt) : new Date()
      }));
      setDocumentInsights(parsedInsights);
      return;
    }
    
    // Generate new insights if not cached
    const newInsights = documents.map((doc, index) => {
      // Use a deterministic seed based on document id to ensure consistent random values
      const seed = doc.id ? doc.id.charCodeAt(0) : index;
      const getSeededRandom = (max: number) => Math.floor((seed * 13) % max);
      
      return {
        id: doc.id || `doc_${index}`,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadedAt: doc.uploadedAt || new Date(),
        complianceScore: 65 + getSeededRandom(35), // Score between 65-99
        riskLevel: ['Low', 'Medium', 'High'][getSeededRandom(3)],
        keyFindings: [
          'Potential compliance issue detected',
          'Requires further review',
          'Meets standard requirements'
        ][getSeededRandom(3)],
        detailedAnalysis: {
          legalComplexity: ['Simple', 'Moderate', 'Complex'][getSeededRandom(3)],
          legalComplexityDetails: [
            'Straightforward document with minimal legal intricacies, low cognitive load for review',
            'Moderate complexity requiring careful review, multiple interconnected clauses',
            'Highly complex legal document with multiple nuanced clauses, demanding comprehensive analysis'
          ][getSeededRandom(3)],
          potentialRisks: [
            'Minor contractual ambiguities that may require clarification',
            'Potential liability exposure in key operational areas',
            'Subtle regulatory compliance risks requiring proactive management'
          ][getSeededRandom(3)],
          riskMitigationStrategy: [
            'Proactive review and targeted amendment of specific sections',
            'Comprehensive legal counsel consultation for holistic risk assessment',
            'Implement robust safeguard clauses and risk management protocols'
          ][getSeededRandom(3)],
          contractualAnalysis: [
            'Standard terms closely aligned with industry best practices',
            'Requires meticulous examination of specific nuanced clauses',
            'Comprehensive and strategically structured contractual framework'
          ][getSeededRandom(3)],
          keyContractualClauses: [
            'Critical focus on Indemnification, Liability, and Termination provisions',
            'Detailed evaluation of Payment terms and performance metrics',
            'In-depth analysis of Confidentiality and intellectual property safeguards'
          ][getSeededRandom(3)],
          complianceAssessment: [
            'Robust compliance with primary regulatory requirements',
            'Identified potential compliance gaps requiring strategic intervention',
            'Exemplary alignment with current legal and industry standards'
          ][getSeededRandom(3)],
          regulatoryAlignment: [
            'Requires strategic refinements to ensure comprehensive compliance',
            'Demonstrates substantial and proactive regulatory alignment',
            'Recommends preemptive compliance enhancement strategies'
          ][getSeededRandom(3)],
          recommendedActions: [
            'Conduct in-depth legal review with specialized counsel',
            'Implement targeted clause modifications',
            'Develop comprehensive compliance enhancement plan'
          ][getSeededRandom(3)],
          nextSteps: [
            'Schedule comprehensive legal strategy session',
            'Initiate collaborative clause negotiation process',
            'Develop risk mitigation and compliance roadmap'
          ][getSeededRandom(3)]
        }
      };
    });
    
    setDocumentInsights(newInsights);
    
    // Cache the insights
    try {
      localStorage.setItem(cachedInsightsKey, JSON.stringify(newInsights));
    } catch (e) {
      console.warn('Failed to cache document insights in localStorage:', e);
    }
  }, [documents]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 bg-[#2C2C2C] p-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-[#3ECF8E]/20 flex items-center justify-center mr-3">
            <BarChart2 className="w-4 h-4 text-[#3ECF8E]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Document Analysis</h3>
            <p className="text-xs text-gray-400">{documents.length} document(s) analyzed</p>
          </div>
        </div>
        
        <button 
          className="
            bg-[#3ECF8E]/10 
            text-[#3ECF8E] 
            hover:bg-[#3ECF8E]/20 
            px-3 
            py-1.5 
            rounded-lg 
            flex 
            items-center 
            space-x-2 
            transition-colors
            text-sm
            self-start sm:self-center
          "
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documentInsights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              bg-[#2C2C2C] 
              border 
              ${selectedDocument === insight.id ? 'border-[#3ECF8E]' : 'border-gray-800'}
              rounded-lg 
              overflow-hidden
              transition-all
              duration-300
            `}
          >
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#3ECF8E]/10 flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-[#3ECF8E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{insight.name}</h3>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span>{insight.type} • {(insight.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-xs px-2 py-1 rounded-md bg-[#3ECF8E]/10 text-[#3ECF8E]">
                    Score: {insight.complianceScore}%
                  </div>
                  
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        insight.complianceScore > 80 ? 'bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5]' :
                        insight.complianceScore > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${insight.complianceScore}%` }}
                    ></div>
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded-md ${getRiskColor(insight.riskLevel)}/10 ${getRiskColor(insight.riskLevel)}`}>
                    {insight.riskLevel} Risk
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-300 mb-3 bg-[#1C1C1C] p-2 rounded-md">
                <TrendingUp className="mr-2 w-4 h-4 text-[#3ECF8E]" />
                {insight.keyFindings}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedDocument(selectedDocument === insight.id ? null : insight.id)}
                  className="
                    text-xs
                    text-[#3ECF8E] 
                    hover:text-[#4ADBA2] 
                    transition-colors
                    flex
                    items-center
                    gap-1
                  "
                >
                  {selectedDocument === insight.id ? 'Hide Details' : 'View Details'}
                  {selectedDocument === insight.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {selectedDocument === insight.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#1C1C1C] border-t border-gray-800 p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#2C2C2C] p-3 rounded-md">
                      <h4 className="text-xs font-semibold text-[#3ECF8E] mb-2">Legal Complexity</h4>
                      <p className="text-sm text-gray-300">{insight.detailedAnalysis.legalComplexity}</p>
                      <div className="mt-2 text-xs text-gray-400 bg-[#1C1C1C] p-2 rounded-md">
                        <Shield className="inline-block mr-2 w-4 h-4 text-[#3ECF8E]" />
                        Complexity Level: {insight.detailedAnalysis.legalComplexityDetails}
                      </div>
                    </div>
                    <div className="bg-[#2C2C2C] p-3 rounded-md">
                      <h4 className="text-xs font-semibold text-[#3ECF8E] mb-2">Potential Risks</h4>
                      <p className="text-sm text-gray-300">{insight.detailedAnalysis.potentialRisks}</p>
                      <div className="mt-2 text-xs text-gray-400 bg-[#1C1C1C] p-2 rounded-md">
                        <AlertTriangle className="inline-block mr-2 w-4 h-4 text-yellow-500" />
                        Risk Mitigation: {insight.detailedAnalysis.riskMitigationStrategy}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#2C2C2C] p-3 rounded-md">
                      <h4 className="text-xs font-semibold text-[#3ECF8E] mb-2">Contractual Analysis</h4>
                      <p className="text-sm text-gray-300">{insight.detailedAnalysis.contractualAnalysis}</p>
                      <div className="mt-2 text-xs text-gray-400 bg-[#1C1C1C] p-2 rounded-md">
                        <TrendingUp className="inline-block mr-2 w-4 h-4 text-green-500" />
                        Key Clauses: {insight.detailedAnalysis.keyContractualClauses}
                      </div>
                    </div>
                    <div className="bg-[#2C2C2C] p-3 rounded-md">
                      <h4 className="text-xs font-semibold text-[#3ECF8E] mb-2">Compliance Assessment</h4>
                      <p className="text-sm text-gray-300">{insight.detailedAnalysis.complianceAssessment}</p>
                      <div className="mt-2 text-xs text-gray-400 bg-[#1C1C1C] p-2 rounded-md">
                        <FileSearch className="inline-block mr-2 w-4 h-4 text-blue-500" />
                        Regulatory Alignment: {insight.detailedAnalysis.regulatoryAlignment}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#2C2C2C] p-3 rounded-md mt-4">
                    <h4 className="text-xs font-semibold text-[#3ECF8E] mb-2">Recommended Actions</h4>
                    <p className="text-sm text-gray-300">{insight.detailedAnalysis.recommendedActions}</p>
                    <div className="mt-2 text-xs text-gray-400 bg-[#1C1C1C] p-2 rounded-md">
                      <Download className="inline-block mr-2 w-4 h-4 text-[#3ECF8E]" />
                      Next Steps: {insight.detailedAnalysis.nextSteps}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 italic text-right">
                    Uploaded: {insight.uploadedAt.toLocaleDateString()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIDocumentInsights;