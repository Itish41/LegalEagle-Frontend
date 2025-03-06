import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner, EmptyState } from './ui/Loader';
import { 
    FileText, 
    RefreshCw, 
    HelpCircle, 
    FileCheck, 
    // File 
} from 'lucide-react';

interface ComplianceResult {
    rule?: string;
    status: string;
    explanation: string;
    severity?: 'low' | 'medium' | 'high';
}

interface Document {
    id: string | number;
    title: string;
    file_url?: string;
    original_url?: string;
    ocr_text: string;
    risk_score: number;
    parsed_data?: string; 
    compliance_status: string;
    compliance_results: ComplianceResult[];
    applicable_rules?: string[];
    compliance_details?: any[];
    file_type?: string;
}

// const getComplianceColor = (status: string): string => {
//     switch(status?.toLowerCase()) {
//         case 'pass': return 'text-green-500 bg-green-900 bg-opacity-20';
//         case 'fail': return 'text-red-500 bg-red-900 bg-opacity-20';
//         case 'warning': return 'text-yellow-500 bg-yellow-900 bg-opacity-20';
//         default: return 'text-gray-500 bg-gray-900 bg-opacity-20';
//     }
// };

// Supabase-inspired Compliance Badge
const ComplianceBadge = ({ status, ruleName }: { status: string, ruleName?: string }) => {
  const badgeColors = {
    'pass': 'bg-[#2C9ED4]/10 text-[#2C9ED4] border border-[#2C9ED4]/20',
    'fail': 'bg-[#E54F4F]/10 text-[#E54F4F] border border-[#E54F4F]/20',
    'unknown': 'bg-gray-100 text-gray-700 border border-gray-200'
  };

  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
      transition-all duration-300 ease-in-out
      ${badgeColors[status as keyof typeof badgeColors] || badgeColors['unknown']}
      hover:shadow-md hover:scale-105
    `}>
      {status.toUpperCase()}
      {ruleName && (
        <span className="ml-2 text-xs opacity-70 font-light">
          ({ruleName})
        </span>
      )}
    </div>
  );
};

// const ComplianceDetailsModal = ({ 
//     isOpen, 
//     onClose, 
//     doc 
// }: { 
//     isOpen: boolean, 
//     onClose: () => void, 
//     doc: any 
// }) => {
//     if (!isOpen) return null;

//     return (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={onClose}
//         >
//             <motion.div 
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-8"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b pb-4 border-slate-200 dark:border-slate-700">
//                     Compliance Insights
//                 </h2>
//                 <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                         <span className="font-semibold text-slate-600 dark:text-slate-300">Document:</span>
//                         <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
//                             {doc.title}
//                         </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                         <span className="font-semibold text-slate-600 dark:text-slate-300">
//                             Overall Status:
//                         </span>
//                         <ComplianceBadge 
//                             status={doc.compliance_status} 
//                             ruleName={doc.applicable_rules?.[0]} 
//                         />
//                     </div>
//                     <div className="border-t pt-4 border-slate-200 dark:border-slate-700">
//                         <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-200">
//                             Detailed Compliance Results:
//                         </h3>
//                         {(doc.compliance_details || []).map((detail: any, index: number) => (
//                             <motion.div 
//                                 key={index}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mb-3 
//                                   transition-all duration-300 ease-in-out 
//                                   hover:shadow-md hover:scale-[1.02]"
//                             >
//                                 <div className="flex justify-between items-center mb-2">
//                                     <span className="font-medium text-slate-800 dark:text-slate-200">
//                                         {detail.rule_name}
//                                     </span>
//                                     <ComplianceBadge status={detail.status} />
//                                 </div>
//                                 {detail.explanation && (
//                                     <p className="text-sm text-slate-600 dark:text-slate-300 
//                                       border-l-4 border-slate-300 dark:border-slate-600 pl-3 mt-2">
//                                         {detail.explanation}
//                                     </p>
//                                 )}
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//                 <button 
//                     onClick={onClose}
//                     className="mt-6 w-full bg-emerald-500 text-white py-3 rounded-lg 
//                       hover:bg-emerald-600 transition-all duration-300 
//                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
//                 >
//                     Close Insights
//                 </button>
//             </motion.div>
//         </motion.div>
//     );
// };

const ComplianceDetailsModal = ({ 
    isOpen, 
    onClose, 
    doc 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    doc: any 
}) => {
    if (!isOpen) return null;

    // Determine compliance status based on risk score
    const complianceStatus = doc.risk_score === 0 ? "Pass" : doc.compliance_status;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b pb-4 border-slate-200 dark:border-slate-700">
                    Compliance Insights
                </h2>
                <div className="max-h-[400px] overflow-y-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Document:</span>
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
                            {doc.title}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                            Overall Status:
                        </span>
                        <ComplianceBadge 
                            status={complianceStatus} // Use the computed compliance status
                            ruleName={doc.applicable_rules?.[0]} 
                        />
                    </div>
                    <div className="border-t pt-4 border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-200">
                            Detailed Compliance Results:
                        </h3>
                        {(doc.compliance_details || []).map((detail: any, index: number) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mb-3 
                                  transition-all duration-300 ease-in-out 
                                  hover:shadow-md hover:scale-[1.02]"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {detail.rule_name}
                                    </span>
                                    <ComplianceBadge status={detail.status} />
                                </div>
                                {detail.explanation && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 
                                      border-l-4 border-slate-300 dark:border-slate-600 pl-3 mt-2">
                                        {detail.explanation}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="mt-6 w-full bg-emerald-500 text-white py-3 rounded-lg 
                      hover:bg-emerald-600 transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    Close Insights
                </button>
            </motion.div>
        </motion.div>
    );
};
const Dashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'title' | 'risk_score'>('risk_score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');

    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://backend:8080/dashboard');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                const processedDocuments = (data.documents || []).map((doc: any) => {
                    return {
                        id: doc.id || doc.ID,
                        title: doc.title || doc.Title || 'Untitled Document',
                        file_url: doc.file_url || doc.FileURL || doc.original_url || doc.OriginalURL || '',
                        ocr_text: doc.ocr_text || doc.OcrText || '',
                        risk_score: Number(doc.risk_score || doc.RiskScore || 0),
                        parsed_data: doc.parsed_data,
                        compliance_status: doc.compliance_status || 'unknown',
                        compliance_results: doc.compliance_details || [],
                        applicable_rules: doc.applicable_rules || [],
                        compliance_details: doc.compliance_details || [],
                        file_type: doc.file_type || 'Unknown'
                    };
                });

                setDocuments(processedDocuments);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const retryFetch = () => {
        setError(null);
        // Trigger fetch again
        useEffect(() => {
            const fetchDocuments = async () => {
                try {
                    setLoading(true);
                    const response = await fetch('http://backend:8080/dashboard');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();

                    const processedDocuments = (data.documents || []).map((doc: any) => {
                        return {
                            id: doc.id || doc.ID,
                            title: doc.title || doc.Title || 'Untitled Document',
                            file_url: doc.file_url || doc.FileURL || doc.original_url || doc.OriginalURL || '',
                            ocr_text: doc.ocr_text || doc.OcrText || '',
                            risk_score: Number(doc.risk_score || doc.RiskScore || 0),
                            parsed_data: doc.parsed_data,
                            compliance_status: doc.compliance_status || 'unknown',
                            compliance_results: doc.compliance_details || [],
                            applicable_rules: doc.applicable_rules || [],
                            compliance_details: doc.compliance_details || [],
                            file_type: doc.file_type || 'Unknown'
                        };
                    });

                    setDocuments(processedDocuments);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            };

            fetchDocuments();
        }, []);
    };

    const filteredAndSortedDocuments = useMemo(() => {
        return documents
            .filter(doc => 
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.ocr_text.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(doc => {
                if (complianceFilter === 'all') return true;
                
                // Check compliance: 'pass' is compliant, everything else is non-compliant
                const isCompliant = (doc.compliance_results || []).every(result => 
                    result.status === 'pass'
                );
                
                return complianceFilter === 'compliant' 
                    ? isCompliant 
                    : !isCompliant;
            })
            .sort((a, b) => {
                const modifier = sortOrder === 'asc' ? 1 : -1;
                if (sortBy === 'title') {
                    return modifier * a.title.localeCompare(b.title);
                }
                return modifier * (a.risk_score - b.risk_score);
            });
    }, [documents, searchTerm, sortBy, sortOrder, complianceFilter]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const openComplianceModal = (doc: any) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
    };

    const closeComplianceModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <Spinner className="w-16 h-16" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <EmptyState 
                    title="Failed to Load Documents" 
                    description={`Something went wrong: ${error}`}
                    icon={<RefreshCw className="w-8 h-8 text-[#2C9ED4]" />}
                    action={
                        <button 
                            onClick={retryFetch}
                            className="bg-[#2C9ED4] text-white px-6 py-2 rounded-lg
                              hover:bg-[#3AACF0] transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-[#2C9ED4] focus:ring-offset-2
                              focus:ring-offset-[#121212]"
                        >
                            Retry Fetch
                        </button>
                    }
                />
            </div>
        );
    }

    // We'll keep the main layout and just show an empty state in the content area
    // This ensures the search bar remains visible even when no documents are found

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#121212] text-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="mb-24 flex justify-between items-center 
              bg-[#1C1C1C] 
              p-4 rounded-xl 
              shadow-md border border-gray-900">
                <div className="relative w-full max-w-md">
                    <input 
                        type="text" 
                        placeholder="Search documents..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full 
                            bg-[#1C1C1C] 
                            border 
                            border-gray-900 
                            rounded-xl 
                            px-4 
                            py-3 
                            text-white 
                            placeholder-gray-500 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-green-500 
                            transition-all 
                            duration-300
                            pl-10
                        "
                    />
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </div>

                <div className="flex space-x-4">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'title' | 'risk_score')}
                        className="bg-[#1C1C1C] border border-gray-900 rounded-xl px-3 py-2"
                    >
                        <option value="risk_score">Sort by Risk Score</option>
                        <option value="title">Sort by Title</option>
                    </select>

                    <button 
                        onClick={toggleSortOrder}
                        className="bg-[#1C1C1C] border border-gray-900 rounded-xl px-3 py-2 flex items-center"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`mr-2 h-5 w-5 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" 
                            />
                        </svg>
                        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>

                    <select 
                        value={complianceFilter}
                        onChange={(e) => setComplianceFilter(e.target.value as 'all' | 'compliant' | 'non-compliant')}
                        className="bg-[#1C1C1C] border border-gray-900 rounded-xl px-3 py-2"
                    >
                        <option value="all">All Documents</option>
                        <option value="compliant">Fully Compliant</option>
                        <option value="non-compliant">Has Compliance Issues</option>
                    </select>
                </div>
            </div>

            {/* Documents Grid */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
                {filteredAndSortedDocuments.map((doc) => (
                    <motion.div 
                        key={doc.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 25px 50px -12px rgba(62, 207, 142, 0.3)"
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-[#1C1C1C] 
                          rounded-2xl 
                          overflow-hidden 
                          border border-gray-900 
                          transition-all duration-300 
                          hover:border-[#3ECF8E]
                          grid grid-cols-1
                          gap-8
                          p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col justify-between space-y-6">
                                <div>
                                    <h3 className="text-3xl font-bold 
                                      text-white 
                                      mb-4
                                      group-hover:text-[#3ECF8E]  
                                      transition-colors duration-300
                                      line-clamp-2
                                      break-words"
                                      title={doc.title}
                                    >
                                      {doc.title.length > 50 
                                        ? `${doc.title.slice(0, 50)}...` 
                                        : doc.title}
                                    </h3>
                                    
                                    <div className="flex items-center 
                                      text-sm text-gray-300 
                                      space-x-3 bg-[#121212] 
                                      p-3 rounded-lg">
                                        <span className="font-medium">Risk Score:</span>
                                        <div 
                                            className={`
                                              font-bold rounded-full px-3 py-1 text-xs
                                              ${doc.risk_score > 0.7 ? 'bg-[#E54F4F]/20 text-[#E54F4F]' : 
                                                doc.risk_score > 0.3 ? 'bg-[#F4B740]/20 text-[#F4B740]' : 
                                                'bg-[#2C9ED4]/20 text-[#2C9ED4]'}
                                            `}
                                        >
                                            {(doc.risk_score * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button 
                                        onClick={() => openComplianceModal(doc)}
                                        className="w-full bg-[#3ECF8E] text-white 
                                          py-3 rounded-lg 
                                          transition-all duration-300 
                                          hover:bg-[#4ADBA2] 
                                          focus:outline-none focus:ring-2 
                                          focus:ring-[#3ECF8E] focus:ring-offset-2
                                          group-hover:bg-opacity-90
                                          flex items-center justify-center space-x-2"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>View Compliance Details</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ 
                                        rotate: [0, 5, -5, 0],
                                        transition: { 
                                            duration: 5, 
                                            repeat: Infinity, 
                                            repeatType: "loop" 
                                        }
                                    }}
                                    className="w-full max-w-[250px] aspect-square 
                                    bg-gradient-to-br from-[#3ECF8E]/20 to-[#7EDCB5]/20 
                                    rounded-2xl 
                                    flex items-center justify-center relative"
                                >
                                    <div className="absolute top-4 right-4">
                                        <ComplianceBadge 
                                            status={doc.compliance_status} 
                                            ruleName={doc.applicable_rules?.[0]} 
                                        />
                                    </div>
                                    <FileCheck className="w-24 h-24 text-[#3ECF8E] opacity-70" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Heading Card */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 25px 50px -12px rgba(62, 207, 142, 0.3)"
                }}
                className="mt-24 bg-[#1C1C1C] 
                  rounded-2xl 
                  overflow-hidden 
                  border border-gray-900 
                  transition-all duration-300 
                  hover:border-[#3ECF8E]
                  grid grid-cols-1 md:grid-cols-2
                  gap-8
                  p-8"
            >
                <div className="flex flex-col justify-center space-y-6">
                    <motion.h1 
                        className="text-5xl font-black 
                          bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] 
                          bg-clip-text text-transparent
                          tracking-tighter
                          font-['Clash_Display', 'Inter', 'system-ui']
                          drop-shadow-[0_5px_5px_rgba(62,207,142,0.2)]
                          uppercase
                          leading-[1.1]"
                    >
                        Unleash Your Legal Compliance
                    </motion.h1>
                    
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Streamline your document compliance with AI-powered insights. 
                        Instantly analyze, assess risks, and ensure regulatory adherence 
                        across your entire document ecosystem.
                    </p>
                    
                    <div className="flex space-x-4">
                        <button 
                            className="bg-[#3ECF8E] text-white 
                            px-6 py-3 rounded-lg 
                            hover:bg-[#4ADBA2]
                            transition-all duration-300
                            flex items-center space-x-2"
                        >
                            <FileText className="w-5 h-5" />
                            <span>Analyze Documents</span>
                        </button>
                        
                        <button 
                            className="bg-[#1C1C1C] text-[#3ECF8E] 
                            border border-[#3ECF8E]
                            px-6 py-3 rounded-lg 
                            hover:bg-[#3ECF8E]/10
                            transition-all duration-300
                            flex items-center space-x-2"
                        >
                            <HelpCircle className="w-5 h-5" />
                            <span>Learn More</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-center">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ 
                            rotate: [0, 5, -5, 0],
                            transition: { 
                                duration: 5, 
                                repeat: Infinity, 
                                repeatType: "loop" 
                            }
                        }}
                        className="w-full max-w-[300px] aspect-square 
                        bg-gradient-to-br from-[#3ECF8E]/20 to-[#7EDCB5]/20 
                        rounded-2xl 
                        flex items-center justify-center"
                    >
                        <FileCheck className="w-32 h-32 text-[#3ECF8E] opacity-70" />
                    </motion.div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && selectedDoc && (
                    <ComplianceDetailsModal 
                        isOpen={isModalOpen} 
                        onClose={closeComplianceModal} 
                        doc={selectedDoc} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;