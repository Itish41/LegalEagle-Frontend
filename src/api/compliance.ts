// Define interfaces for compliance-related data
export interface ComplianceRule {
  rule_name: string;
  status: 'pass' | 'fail';
  severity?: 'low' | 'medium' | 'high';
  explanation?: string;
}

export interface ComplianceInsight {
  documentId: string;
  overallStatus: 'Compliant' | 'Non-Compliant';
  riskScore: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  violatedRules: ComplianceRule[];
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  keyInsights?: string;
}

export interface ComplianceResult {
  documentId: string;
  overallStatus: 'Compliant' | 'Non-Compliant';
  riskScore: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  violatedRules?: ComplianceRule[];
  keyInsights?: string;
}

export interface ComplianceAnalysisParams {
  documentId: string;
  documentText?: string;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  fileType: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  parsedData: ComplianceRule[];
  ocrText: string;
  overallStatus: 'Compliant' | 'Non-Compliant';
  keyInsights?: string;
}

interface UploadedDocument {
  id?: string;
  name: string;
  type: string;
  size?: number;
  uploadedAt?: Date;
  ocrText?: string;
}

export function calculateRiskLevel(riskScore: number): 'Low' | 'Medium' | 'High' {
  if (riskScore > 70) return 'High';
  if (riskScore > 30) return 'Medium';
  return 'Low';
}

class ComplianceService {
  private baseUrl = '/'; // Base URL for the backend

  // Fetch compliance rules
  async getAllRules(): Promise<ComplianceRule[]> {
    try {
      const response = await fetch(`${this.baseUrl}rules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compliance rules');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching compliance rules:', error);
      throw error;
    }
  }

  // Fetch all documents with compliance information
  async getAllDocumentsWithCompliance(): Promise<ComplianceDocument[]> {
    try {
      // In development, generate documents using Groq if no API endpoint is available
      if (import.meta.env.DEV) {
        // Fetch documents from local storage or state management
        const localDocumentsJson = localStorage.getItem('uploadedDocuments');
        const localDocuments: UploadedDocument[] = localDocumentsJson 
          ? JSON.parse(localDocumentsJson) 
          : [];

        if (localDocuments.length > 0) {
          console.warn('Generating compliance documents using Groq');
          return await this.generateComplianceDocumentsFromGroq(localDocuments);
        }
      }

      // Existing API endpoint fetch logic
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '/api/documents/compliance';
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', await response.text());
        
        // Fallback to Groq generation if development
        if (import.meta.env.DEV) {
          const localDocumentsJson = localStorage.getItem('uploadedDocuments');
          const localDocuments: UploadedDocument[] = localDocumentsJson 
            ? JSON.parse(localDocumentsJson) 
            : [];
          
          return await this.generateComplianceDocumentsFromGroq(localDocuments);
        }

        throw new Error('Expected JSON response, received different content type');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Detailed error response:', errorText);
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || !Array.isArray(data.documents)) {
        console.warn('Unexpected response structure:', data);
        return [];
      }

      return data.documents;
    } catch (error: unknown) {
      // Comprehensive error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Unknown fetch error';
      
      console.error('Error fetching documents:', errorMessage);
      
      // Fallback to Groq generation if development
      if (import.meta.env.DEV) {
        const localDocumentsJson = localStorage.getItem('uploadedDocuments');
        const localDocuments: UploadedDocument[] = localDocumentsJson 
          ? JSON.parse(localDocumentsJson) 
          : [];
        
        return await this.generateComplianceDocumentsFromGroq(localDocuments);
      }

      return [];
    }
  }

  // // Generate mock compliance documents for development
  // private generateMockComplianceDocuments(): ComplianceDocument[] {
  //   return [
  //     {
  //       id: '1741083892-Mocking Legal Agreement.pdf',
  //       title: 'Mocking Legal Agreement',
  //       fileType: 'pdf',
  //       riskScore: 50,
  //       riskLevel: 'Medium',
  //       parsedData: [
  //         {
  //           rule_name: 'General Compliance',
  //           status: 'pass',
  //           severity: 'low',
  //           explanation: 'No significant compliance issues detected'
  //         }
  //       ],
  //       ocrText: 'Sample OCR text for mock document',
  //       overallStatus: 'Compliant',
  //       keyInsights: 'No specific insights available'
  //     }
  //   ];
  // }

  // Analyze document for compliance
  async analyzeDocument(params: ComplianceAnalysisParams): Promise<ComplianceResult> {
    try {
      // Fetch specific document details
      const documentsResponse = await this.getAllDocumentsWithCompliance();
      const documentDetails = documentsResponse.find(doc => doc.id === params.documentId);

      if (!documentDetails) {
        throw new Error(`Document with ID ${params.documentId} not found`);
      }

      // Parse compliance results from parsedData
      const parsedData = documentDetails.parsedData || [];
      
      return {
        documentId: documentDetails.id,
        overallStatus: documentDetails.overallStatus,
        riskScore: documentDetails.riskScore,
        riskLevel: documentDetails.riskLevel,
        violatedRules: parsedData
          .filter((rule: any) => rule.status === 'fail')
          .map((rule: any) => ({
            rule_name: rule.rule_name,
            status: 'fail',
            severity: rule.severity,
            explanation: rule.explanation
          })),
        keyInsights: documentDetails.keyInsights
      };
    } catch (error) {
      console.error('Error analyzing document compliance:', error);
      
      // Provide a fallback result in case of error
      return {
        documentId: params.documentId,
        overallStatus: 'Compliant',
        riskScore: 0,
        riskLevel: 'Low',
        violatedRules: [],
        keyInsights: 'No specific insights available'
      };
    }
  }

  // Get compliance history for a document
  async getDocumentComplianceHistory(documentId: string): Promise<ComplianceResult[]> {
    try {
      const documentsResponse = await this.getAllDocumentsWithCompliance();
      
      // Filter documents and map to ComplianceResult
      return documentsResponse
        .filter(doc => doc.id === documentId)
        .map(doc => ({
          documentId: doc.id,
          overallStatus: doc.overallStatus,
          riskScore: doc.riskScore,
          riskLevel: doc.riskLevel,
          violatedRules: (doc.parsedData || [])
            .filter((rule: any) => rule.status === 'fail')
            .map((rule: any) => ({
              rule_name: rule.rule_name,
              status: 'fail',
              severity: rule.severity,
              explanation: rule.explanation
            })),
          keyInsights: doc.keyInsights
        }));
    } catch (error) {
      console.error('Error fetching compliance history:', error);
      return [];
    }
  }

  // Generate compliance report
  async generateComplianceReport(documentIds: string[]): Promise<Blob> {
    try {
      const documentsResponse = await this.getAllDocumentsWithCompliance();
      
      // Filter and process documents
      const filteredDocs = documentsResponse.filter(doc => documentIds.includes(doc.id));
      
      // Create a detailed report
      const reportContent = filteredDocs.map(doc => 
        `Document ID: ${doc.id}
Title: ${doc.title}
Risk Score: ${doc.riskScore.toFixed(2)}
Risk Level: ${doc.riskLevel}
Status: ${doc.overallStatus}
Violated Rules:
${(doc.parsedData || [])
  .filter((rule: any) => rule.status === 'fail')
  .map((rule: any) => `- ${rule.rule_name} (${rule.severity}): ${rule.explanation}`)
  .join('\n') || 'No rule violations'}
---
`
      ).join('\n');

      return new Blob([reportContent], { type: 'text/plain' });
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }

  private mapToComplianceInsight(
    doc: ComplianceDocument, 
    additionalData?: Partial<Omit<ComplianceInsight, keyof ComplianceDocument>>
  ): ComplianceInsight {
    return {
      documentId: doc.id,
      overallStatus: doc.overallStatus,
      riskScore: doc.riskScore,
      riskLevel: calculateRiskLevel(doc.riskScore),
      violatedRules: doc.parsedData.filter(rule => rule.status === 'fail'),
      name: doc.title,
      type: doc.fileType,
      size: 0, 
      uploadedAt: new Date(), 
      keyInsights: doc.keyInsights,
      ...additionalData
    };
  }

  async getDocumentCompliance(documentId: string): Promise<ComplianceInsight | null> {
    try {
      const documents = await this.getAllDocumentsWithCompliance();
      const document = documents.find(doc => doc.id === documentId);
      
      return document ? this.mapToComplianceInsight(document) : null;
    } catch (error) {
      console.error('Error fetching document compliance:', error);
      return null;
    }
  }

  // Generate compliance documents dynamically using Groq
  private async generateComplianceDocumentsFromGroq(documents: UploadedDocument[]): Promise<ComplianceDocument[]> {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        console.error('Groq API key not found');
        return [];
      }

      // Fetch available compliance rules 
      const availableRules = await this.fetchAvailableComplianceRules();
      const ruleDetails = availableRules.map(rule => 
        `${rule.name}: ${rule.description}`
      );

      // Process documents in parallel
      const complianceDocuments = await Promise.all(documents.map(async (doc) => {
        try {
          const prompt = `
            Analyze the following document text and suggest the most relevant legal compliance rules to check from this list:
            ${ruleDetails.join('\n')}

            Document Text:
            ${doc.ocrText || 'No text available'}

            Instructions:
            1. Carefully review the entire document text.
            2. Match the content to the rules based on their names and descriptions.
            3. Return a JSON object with an "applicable_rules" array containing rule names.
            4. Provide a risk score between 0-100 representing compliance risk.
            5. Include key insights about potential compliance issues.

            Response Format:
            {
                "applicable_rules": ["Rule1", "Rule2", ...],
                "risk_score": 0-100,
                "key_insights": "Brief summary of findings"
            }
          `;

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'llama3-70b-8192',
              response_format: { type: 'json_object' },
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 500,
              temperature: 0.7
            })
          });

          if (!response.ok) {
            console.error('Groq API error:', await response.text());
            return null;
          }

          const data = await response.json();
          const complianceResult = JSON.parse(data.choices[0]?.message?.content || '{}');

          // Validate and process applicable rules
          const applicableRules = (complianceResult.applicable_rules || ['General Compliance'])
            .filter((rule: string) => 
              availableRules.some(availRule => availRule.name === rule)
            );

          // Calculate risk score
          const riskScore = complianceResult.risk_score || 50;
          const riskLevel = calculateRiskLevel(riskScore);

          // Generate parsed data for rules
          const parsedData = availableRules.map(rule => ({
            rule_name: rule.name,
            status: applicableRules.includes(rule.name) ? 'fail' : 'pass',
            severity: rule.severity,
            explanation: applicableRules.includes(rule.name) 
              ? `The document potentially violates the '${rule.name}' rule.`
              : `The document complies with the '${rule.name}' rule.`
          }));

          return {
            id: doc.id || '',
            title: doc.name,
            fileType: doc.type,
            riskScore: riskScore,
            riskLevel: riskLevel,
            parsedData: parsedData,
            ocrText: doc.ocrText || '',
            overallStatus: riskScore > 50 ? 'Non-Compliant' : 'Compliant',
            keyInsights: complianceResult.key_insights || 'No specific insights available'
          } as ComplianceDocument;
        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
          return null;
        }
      }));

      // Filter out null results
      return complianceDocuments.filter((doc): doc is ComplianceDocument => doc !== null);
    } catch (error) {
      console.error('Error generating compliance documents:', error);
      return [];
    }
  }

  // Fetch available compliance rules
  private async fetchAvailableComplianceRules(): Promise<{
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[]> {
    try {
      // In a real-world scenario, this would be an API call to your backend
      // For now, we'll use a mock implementation
      return [
        {
          name: 'General Compliance',
          description: 'Basic compliance check for all documents',
          severity: 'low'
        },
        {
          name: 'Data Protection',
          description: 'Ensure document complies with data protection regulations',
          severity: 'high'
        },
        {
          name: 'Contract Terms',
          description: 'Verify standard contract terms and conditions',
          severity: 'medium'
        }
      ];
    } catch (error) {
      console.error('Error fetching compliance rules:', error);
      return [];
    }
  }

  private getAuthToken(): string {
    // Implement authentication token retrieval logic here
    // For demonstration purposes, a placeholder token is used
    return 'your-auth-token';
  }
}

export const complianceService = new ComplianceService();
export default complianceService;
