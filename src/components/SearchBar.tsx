import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Loader2, 
  AlertTriangle, 
  FileText,
  // Calendar,
  ExternalLink
} from 'lucide-react';

interface SearchResult {
  id: string;
  document_url: string;
  document_name: string;
  document_type: string;
  document_size: number;
  uploaded_at: string;
  preview_text: string;
  tags?: string[];
  metadata?: {
    pages?: number;
    author?: string;
    created_date?: string;
  };
}

interface BackendSearchResult {
  file_id: string;
  file_url: string;
  ocr_text: string;
  timestamp: string;
}

interface SearchResponse {
  message: string;
  results: BackendSearchResult[];
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

// const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

const getFileIcon = (fileType?: string | null) => {
  const safeFileType = fileType?.toLowerCase() || 'default';

  const iconMap: { [key: string]: React.ReactNode } = {
    'pdf': <FileText className="text-red-500" size={20} />,
    'doc': <FileText className="text-blue-500" size={20} />,
    'docx': <FileText className="text-blue-500" size={20} />,
    'txt': <FileText className="text-green-500" size={20} />,
    'default': <FileText className="text-gray-500" size={20} />
  };

  return iconMap[safeFileType] || iconMap['default'];
};

const mapBackendResultToSearchResult = (result: BackendSearchResult): SearchResult => ({
  id: result.file_id,
  document_url: result.file_url,
  document_name: extractDocumentName(result.file_id),
  document_type: extractFileType(result.file_id),
  document_size: 0, // Add logic to get file size if needed
  uploaded_at: result.timestamp,
  preview_text: truncateText(result.ocr_text, 200),
  metadata: {
    pages: extractPageCount(result.ocr_text)
  }
});

const extractDocumentName = (fileId: string): string => {
  return fileId.split('-').slice(1).join('-');
};

const extractFileType = (fileId: string): string => {
  const parts = fileId.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'pdf';
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
};

const extractPageCount = (ocrText: string): number => {
  const pageMatch = ocrText.match(/Page (\d+)/);
  return pageMatch ? parseInt(pageMatch[1], 10) : 1;
};

const appleScrollVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  },
  exit: { 
    opacity: 0.3, 
    y: 20,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
      duration: 0.8
    }
  }
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('Current Search State:', {
      query,
      isLoading,
      error,
      resultsCount: searchResults.length
    });
  }, [query, isLoading, error, searchResults]);

  const handleSearch = async () => {
    console.log('Search initiated with query:', query);

    if (!query.trim()) {
      console.warn('Empty query attempt');
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      console.log('Fetching search results...');
      
      const response = await fetch(`http://backend:8080/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search error response:', errorText);
        throw new Error(errorText || 'Search failed');
      }

      let data: SearchResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        setError('Invalid response from server');
        return;
      }

      console.group('Search Results');
      console.log('Raw Response:', JSON.stringify(data, null, 2));
      console.log('Number of Results:', data.results?.length || 0);
      console.groupEnd();

      if (onSearch) {
        onSearch(query);
      }

      if (!data.results || data.results.length === 0) {
        console.warn('No results returned:', data.message);
        setError(data.message || 'No results found');
        return;
      }

      const mappedResults = data.results.map(mapBackendResultToSearchResult);

      console.log('Setting search results:', mappedResults);
      setSearchResults(mappedResults);

    } catch (err) {
      console.error('Comprehensive search error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      console.log('Search process completed');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleResultExpansion = (resultId: string) => {
    setExpandedResultId(prevId => prevId === resultId ? null : resultId);
  };

  // const clearSearch = () => {
  //   setQuery('');
  //   setSearchResults([]);
  //   setError(null);
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // };

  const openFileInNewTab = (fileUrl: string) => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      variants={appleScrollVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ amount: 0.1 }}
      className="w-full"
    >
      <div className="relative w-full max-w-full">
        <div className="flex items-center bg-[#1C1C1C] border border-gray-800 rounded-full p-2">
          <Search className="text-gray-400 ml-4 mr-2" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="
              w-full 
              bg-transparent 
              text-white 
              placeholder-gray-500 
              outline-none 
              px-2 
              py-2 
              text-lg
            "
          />
          {query && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuery('')}
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="
              bg-green-500 
              text-black 
              px-6 
              py-3 
              rounded-full 
              font-bold 
              text-lg 
              hover:bg-green-400 
              transition-colors
            "
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Search'
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mt-4 
              bg-red-900/20 
              border 
              border-red-900 
              text-red-400 
              px-4 
              py-2 
              rounded-lg 
              flex 
              items-center 
              space-x-2
            "
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 space-y-4"
            >
              {searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleResultExpansion(result.id)}
                  className="
                    bg-[#2C2C2C] 
                    border 
                    border-gray-800 
                    rounded-2xl 
                    p-6 
                    hover:border-green-500/50 
                    transition-all 
                    duration-300
                    cursor-pointer
                  "
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(result.document_type)}
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {result.document_name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {result.document_type.toUpperCase()} • {result.uploaded_at}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card expansion
                        openFileInNewTab(result.document_url);
                      }}
                      className="
                        text-green-500 
                        hover:text-green-400 
                        transition-colors
                      "
                    >
                      <ExternalLink size={20} />
                    </motion.button>
                  </div>
                  
                  {expandedResultId === result.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 text-gray-300"
                    >
                      <p>{result.preview_text}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;