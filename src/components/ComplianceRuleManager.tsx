import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

interface ComplianceRule {
  ID: string;  
  Name: string;  
  Description: string;  
  Pattern: string;  
  Severity: string;  
  CreatedAt?: string;  
}

const ComplianceRuleManager: React.FC = () => {
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'view'>('view');
  const [newRule, setNewRule] = useState<Omit<ComplianceRule, 'ID' | 'CreatedAt'>>({
    Name: '',
    Pattern: '',
    Severity: 'medium',
    Description: ''
  });

  // Fetch all rules
  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://legaleagle-backend.onrender.com/rules');
      if (!response.ok) {
        throw new Error(`Error fetching rules: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched Rules:', data); 
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching rules:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new rule
  const addRule = async () => {
    if (!newRule.Name || !newRule.Pattern) {
      setError('Name and pattern are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://legaleagle-backend.onrender.com/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRule),
      });

      if (!response.ok) {
        throw new Error(`Error adding rule: ${response.statusText}`);
      }

      // Reset form and refresh rules
      setNewRule({
        Name: '',
        Pattern: '',
        Severity: 'medium',
        Description: ''
      });
      
      // Switch to view tab and refresh rules
      setActiveTab('view');
      fetchRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error adding rule:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="bg-[#1A1A1A] text-gray-200 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3ECF8E]">Compliance Rules Manager</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'view' 
                ? 'bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5] text-black' 
                : 'bg-[#2C2C2C] hover:bg-[#3C3C3C]'
            }`}
          >
            View Rules
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'add' 
                ? 'bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5] text-black' 
                : 'bg-[#2C2C2C] hover:bg-[#3C3C3C]'
            }`}
          >
            Add Rule
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Add new rule form */}
      {activeTab === 'add' && (
        <div className="bg-[#2C2C2C] p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-[#3ECF8E] mb-4">Add New Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rule Name</label>
              <input
                type="text"
                value={newRule.Name}
                onChange={(e) => setNewRule({...newRule, Name: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-sm"
                placeholder="e.g., Signature Requirement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pattern</label>
              <input
                type="text"
                value={newRule.Pattern}
                onChange={(e) => setNewRule({...newRule, Pattern: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-sm"
                placeholder="e.g., signature|signed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select
                value={newRule.Severity}
                onChange={(e) => setNewRule({...newRule, Severity: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={newRule.Description}
                onChange={(e) => setNewRule({...newRule, Description: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-sm"
                placeholder="Brief description of the rule"
              />
            </div>
          </div>
          <button
            onClick={addRule}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#3ECF8E] to-[#7EDCB5] text-black font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} />
            Add Rule
          </button>
        </div>
      )}

      {/* Rules list */}
      {activeTab === 'view' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#3ECF8E]">Existing Rules</h3>
            <button 
              onClick={fetchRules}
              className="flex items-center gap-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] px-4 py-2 rounded-md text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="text-center py-4">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-4 text-gray-400">No compliance rules found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2C2C2C] text-left">
                  <tr>
                    <th className="p-3 text-sm font-medium">Name</th>
                    <th className="p-3 text-sm font-medium">Pattern</th>
                    <th className="p-3 text-sm font-medium">Severity</th>
                    <th className="p-3 text-sm font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => {
                    console.log('Rendering Rule:', rule); 
                    return (
                      <tr key={rule.ID} className="border-t border-gray-800 hover:bg-[#2C2C2C]">
                        <td className="p-3 text-sm">{rule.Name || 'N/A'}</td>
                        <td className="p-3 text-sm font-mono ">{rule.Pattern || 'N/A'}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rule.Severity === 'high' ? 'bg-red-900/30 text-red-200' : 
                            rule.Severity === 'medium' ? 'bg-yellow-900/30 text-yellow-200' : 
                            'bg-green-900/30 text-green-200'
                          }`}>
                            {rule.Severity || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{rule.Description || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceRuleManager;
