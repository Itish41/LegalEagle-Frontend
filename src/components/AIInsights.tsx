import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import '../index.css';
import { 
  // Zap, 
  Loader2, 
  AlertTriangle, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

// Interface defining the props for AIInsights component
interface AIInsightsProps {
  documentText: string;
  icon?: React.ReactNode;
  title: string;
}

// Interface for insight sections
interface InsightSection {
  title: string;
  content: string;
  expanded?: boolean;
}

// Default insights text when no document is analyzed
const DEFAULT_INSIGHTS = `## AI-Powered Legal Insights

- **Instant Document Analysis**: Leverage cutting-edge AI to extract critical insights from your legal documents
- **Comprehensive Coverage**: Analyze contracts, agreements, and legal texts with unprecedented accuracy
- **Actionable Intelligence**: Transform complex legal text into clear, actionable recommendations

## Contract Analysis
- **Key Terms Identification**: Automatically identify and highlight important contract terms
- **Obligation Tracking**: Track obligations, deadlines, and renewal dates
- **Risk Assessment**: Identify potential risks and ambiguities in legal language

## Compliance Check
- **Regulatory Alignment**: Verify alignment with relevant regulations and standards
- **Jurisdiction Analysis**: Identify jurisdiction-specific requirements and concerns
- **Compliance Gaps**: Highlight potential compliance gaps requiring attention

## Strategic Recommendations
- **Negotiation Points**: Identify key points for negotiation or amendment
- **Risk Mitigation**: Suggest strategies to address identified risks
- **Process Optimization**: Recommend improvements to legal workflows

*Upload a document to get personalized, in-depth legal insights.*`;

// AIInsights component for generating AI-powered document insights
const AIInsights: React.FC<AIInsightsProps> = ({ 
  documentText
  // icon, 
  // title 
}) => {
  // State management for insights, loading, and error handling
  const [insights, setInsights] = useState<string>(DEFAULT_INSIGHTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [insightSections, setInsightSections] = useState<InsightSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // Static document key to ensure we don't regenerate insights for the same document
  const [documentKey, setDocumentKey] = useState<string>('');

  // Effect to generate insights when document text changes, but only on initial load or when text actually changes
  useEffect(() => {
    // Only regenerate insights if the document text has actually changed
    const newDocumentKey = documentText.trim().substring(0, 100); // Use a substring of the document as a key
    
    // If document is empty, show default insights
    if (!documentText.trim()) {
      setInsights(DEFAULT_INSIGHTS);
      return;
    }
    
    // If we already have insights for this document and the document hasn't changed, don't regenerate
    if (insights !== DEFAULT_INSIGHTS && documentKey === newDocumentKey) {
      return;
    }
    
    // Update the document key
    setDocumentKey(newDocumentKey);
    
    // Try to get cached insights from localStorage
    const cachedInsightsKey = `insights_${newDocumentKey}`;
    const cachedSectionsKey = `sections_${newDocumentKey}`;
    const cachedInsights = localStorage.getItem(cachedInsightsKey);
    const cachedSections = localStorage.getItem(cachedSectionsKey);
    
    if (cachedInsights && cachedSections) {
      // Use cached insights if available
      console.log('Using cached insights');
      setInsights(cachedInsights);
      setInsightSections(JSON.parse(cachedSections));
      return;
    }
    
    console.log('Generating new insights');
    
    const generateInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate Groq API key
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
          throw new Error('Groq API Key is missing. Please check your environment configuration.');
        }

        // API request to generate insights
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192', // Groq's Llama 3 model
            messages: [
              {
                role: 'system',
                content: `You are an expert legal document analyst. 
                Provide a comprehensive and detailed analysis of the document. 
                Follow these strict guidelines:
                1. Use a clear, professional tone
                2. Organize insights into multiple detailed sections
                3. Use markdown formatting extensively for readability
                4. Highlight critical information with bold and italics
                5. Avoid unnecessary legal jargon
                6. Focus on practical implications and actionable recommendations
                7. Provide specific examples from the text when relevant
                8. Include section headers for different parts of your analysis`
              },
              {
                role: 'user',
                content: `Analyze the following legal document and provide a detailed, structured analysis:

Document Content:
${documentText}

Required Output Format:
## Document Overview
*Brief description of document type and purpose*

## Key Provisions
- **Provision 1**: Detailed explanation with implications
- **Provision 2**: Detailed explanation with implications
- **Provision 3**: Detailed explanation with implications

## Legal Risks and Concerns
*Detailed analysis of potential legal risks*

## Compliance Considerations
*Analysis of relevant compliance requirements*

## Strategic Recommendations
*Detailed, actionable recommendations*

## Additional Notes
*Any other important observations*

Emphasize thoroughness, clarity, and practical understanding.`
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            stream: false
          })
        });

        // Handle API response errors
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Full error response:', errorBody);
          throw new Error(`Failed to generate insights: ${errorBody}`);
        }

        // Extract and set insights from API response
        const data = await response.json();
        const generatedInsights = data.choices[0]?.message?.content?.trim() || 'No insights generated.';
        
        setInsights(generatedInsights);
        
        // Parse insights into sections
        const sections = parseInsightsIntoSections(generatedInsights);
        setInsightSections(sections);
        
        // Cache the insights and sections in localStorage
        try {
          localStorage.setItem(cachedInsightsKey, generatedInsights);
          localStorage.setItem(cachedSectionsKey, JSON.stringify(sections));
        } catch (e) {
          console.warn('Failed to cache insights in localStorage:', e);
        }
      } catch (err) {
        // Error handling
        console.error('Error generating AI insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate AI insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [documentText]);

  // Parse insights text into structured sections
  const parseInsightsIntoSections = (text: string): InsightSection[] => {
    const sections: InsightSection[] = [];
    
    // Split by markdown headers
    const lines = text.split('\n');
    let currentTitle = '';
    let currentContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line is a header
      if (line.startsWith('##')) {
        // If we already have content, save the previous section
        if (currentTitle) {
          sections.push({
            title: currentTitle,
            content: currentContent.trim(),
            expanded: false
          });
        }
        
        // Start a new section
        currentTitle = line.replace(/^##\s*/, '').trim();
        currentContent = '';
      } else if (line.startsWith('#')) {
        // Main title, skip
        continue;
      } else {
        // Add to current content
        currentContent += line + '\n';
      }
    }
    
    // Add the last section
    if (currentTitle) {
      sections.push({
        title: currentTitle,
        content: currentContent.trim(),
        expanded: false
      });
    }
    
    // If no sections were found, create a default one
    if (sections.length === 0) {
      sections.push({
        title: 'Document Analysis',
        content: text,
        expanded: false
      });
    }
    
    return sections;
  };
  
  // Toggle section expansion
  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Toggle all sections
  const toggleAllSections = () => {
    if (expandedSection !== null) {
      // If any section is expanded, collapse all
      setExpandedSection(null);
    } else if (insightSections.length > 0) {
      // Expand the first section if all are collapsed
      setExpandedSection(0);
    }
  };

  // Render component with insights, loading state, and error handling
  return (
    <div className="space-y-4">
      {/* Component header is now handled by parent component */}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-6 space-x-3 text-gray-400 bg-[#1C1C1C] rounded-lg border border-gray-800">
          <Loader2 className="animate-spin w-5 h-5" />
          <span className="text-sm">Generating insights...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center space-x-2 bg-red-900/10 border border-red-900/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Insights display */}
      {!isLoading && !error && insights && (
        <div className="space-y-4">
          {/* Summary view */}
          <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-5 text-gray-300">
            <div className="flex items-start space-x-3 mb-4">
              <Lightbulb className="text-yellow-400 flex-shrink-0 w-5 h-5 mt-1" />
              <div className="prose prose-invert prose-sm max-w-none w-full animate-fadeIn">
                {!showDetails && (
                  <div>
                    {insights.split('\n').slice(0, 7).map((line, index) => {
                      // Format markdown headers
                      if (line.startsWith('##')) {
                        return <h3 key={index} className="text-lg font-bold text-[#3ECF8E] mt-4 mb-2">{line.replace(/^##\s*/, '')}</h3>;
                      } else if (line.startsWith('#')) {
                        return <h2 key={index} className="text-xl font-bold text-white mt-4 mb-3">{line.replace(/^#\s*/, '')}</h2>;
                      } else if (line.startsWith('-')) {
                        // Format list items with bold and italics
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-2">
                            <span className="text-[#3ECF8E] mt-1">•</span>
                            <p className="text-sm" dangerouslySetInnerHTML={{ 
                              __html: line.replace(/^-\s*/, '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em class="text-gray-400">$1</em>')
                            }} />
                          </div>
                        );
                      } else if (line.trim() === '') {
                        return <div key={index} className="h-2"></div>;
                      } else {
                        return <p key={index} className="text-sm mb-2">{line}</p>;
                      }
                    })}
                    {insights.split('\n').length > 7 && (
                      <p className="text-xs text-gray-500 mt-2">... more content available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* View details button */}
            <div className="flex justify-end mt-3">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[#3ECF8E] hover:text-[#4ADBA2] transition-colors text-sm font-medium bg-[#3ECF8E]/10 px-3 py-1.5 rounded-lg hover:bg-[#3ECF8E]/20"
              >
                <span>{showDetails ? 'Hide Details' : 'View Full Analysis'}</span>
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
            
          {/* Detailed view */}
          {showDetails && (
            <div className="overflow-hidden bg-[#2C2C2C] border border-gray-800 rounded-lg p-5">
              {/* Expandable sections */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#2C2C2C] animate-fadeIn">
                {insightSections.map((section, index) => (
                  <div 
                    key={index}
                    className="bg-[#1C1C1C] border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#3ECF8E]/30 shadow-sm"
                  >
                  <div 
                    key={index}
                    className="bg-[#1C1C1C] border border-gray-800 rounded-lg overflow-hidden"
                  >
                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#333] transition-colors group"
                    >
                      <h4 className="font-medium text-white flex items-center text-base">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3ECF8E] to-[#7EDCB5] flex items-center justify-center text-black mr-3 text-xs shadow-sm group-hover:shadow-[#3ECF8E]/20 transition-all">
                          {index + 1}
                        </span>
                        <span className="group-hover:text-[#3ECF8E] transition-colors">{section.title}</span>
                      </h4>
                      {expandedSection === index ? 
                        <ChevronUp size={16} className="text-[#3ECF8E] group-hover:scale-110 transition-transform" /> : 
                        <ChevronDown size={16} className="group-hover:text-[#3ECF8E] group-hover:scale-110 transition-all" />}
                    </button>
                    
                    {/* Section content */}
                    {expandedSection === index && (
                      <div className="overflow-hidden">
                        <div className="p-5 border-t border-gray-800 prose prose-invert prose-sm max-w-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#1C1C1C] overflow-y-auto max-h-[400px]">
                          {section.content.split('\n').map((line, lineIndex) => {
                            // Format markdown elements
                            if (line.startsWith('-')) {
                              return (
                                <div key={lineIndex} className="flex items-start space-x-2 mb-3 hover:bg-[#2C2C2C] p-1 rounded-md transition-colors">
                                  <span className="text-[#3ECF8E] mt-1">•</span>
                                  <p className="text-sm" dangerouslySetInnerHTML={{ 
                                    __html: line.replace(/^-\s*/, '')
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                      .replace(/\*(.*?)\*/g, '<em class="text-gray-400">$1</em>')
                                  }} />
                                </div>
                              );
                            } else if (line.trim() === '') {
                              return <div key={lineIndex} className="h-3"></div>;
                            } else {
                              return <p key={lineIndex} className="text-sm mb-3 hover:bg-[#2C2C2C] p-1 rounded-md transition-colors" dangerouslySetInnerHTML={{ 
                                __html: line
                                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em class="text-gray-400">$1</em>')
                                  .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#3ECF8E] hover:underline">$1</a>')
                              }} />;
                            }
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                ))}
              </div>
              
              {/* Additional actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <button 
                    className="flex items-center gap-1 text-xs bg-[#1C1C1C] text-gray-300 hover:bg-[#2C2C2C] px-3 py-1.5 rounded-lg transition-colors border border-gray-700"
                    onClick={toggleAllSections}
                  >
                    {expandedSection !== null ? (
                      <>
                        <ChevronUp size={14} />
                        <span>Collapse All</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        <span>Expand First Section</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Export as TXT */}
                  <button 
                    className="flex items-center gap-1 text-xs bg-[#3ECF8E]/10 text-[#3ECF8E] hover:bg-[#3ECF8E]/20 px-3 py-1.5 rounded-lg transition-colors"
                    onClick={() => {
                      const blob = new Blob([insights], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'legal-document-insights.txt';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Export as TXT</span>
                  </button>
                  
                  {/* Export as HTML */}
                  <button 
                    className="flex items-center gap-1 text-xs bg-[#3ECF8E]/10 text-[#3ECF8E] hover:bg-[#3ECF8E]/20 px-3 py-1.5 rounded-lg transition-colors"
                    onClick={() => {
                      // Convert markdown to HTML
                      const htmlContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Legal Document Insights</title>
                          <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                            h1 { color: #3ECF8E; }
                            h2 { color: #3ECF8E; margin-top: 20px; }
                            h3 { margin-top: 16px; }
                            ul { padding-left: 20px; }
                            li { margin-bottom: 8px; }
                            strong { color: #333; }
                            .section { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
                          </style>
                        </head>
                        <body>
                          <div class="content">
                            ${insights
                              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/^- (.*$)/gm, '<li>$1</li>')
                              .replace(/\n\n/g, '</p><p>')
                              .replace(/^\n/gm, '<br>')}
                          </div>
                        </body>
                        </html>
                      `;
                      
                      const blob = new Blob([htmlContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'legal-document-insights.html';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Export as HTML</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
