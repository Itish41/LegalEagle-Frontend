import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, HelpCircle, Search as SearchIcon } from 'lucide-react';
import SearchBar from './SearchBar';

const SearchPage: React.FC = () => {
  const [searchResults] = useState([]);

  return (
    <div className="w-full space-y-10">
      {/* Search Bar Section */}
      <div className="glass-card p-6 rounded-xl border border-gray-800 mb-12">
        <SearchBar />
      </div>

      {/* Heading Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 25px 50px -12px rgba(62, 207, 142, 0.3)"
        }}
        className="bg-[#1C1C1C] 
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
            Discover Your Documents
          </motion.h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Effortlessly search and retrieve documents with our advanced AI-powered 
            search capabilities. Find exactly what you need with intelligent 
            filtering and comprehensive document insights.
          </p>
          
          <div className="flex space-x-4">
            <button 
              className="bg-[#3ECF8E] text-white 
              px-6 py-3 rounded-lg 
              hover:bg-[#4ADBA2]
              transition-all duration-300
              flex items-center space-x-2"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Advanced Search</span>
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
              <span>Search Tips</span>
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
            <FileText className="w-32 h-32 text-[#3ECF8E] opacity-70" />
          </motion.div>
        </div>
      </motion.div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          {/* Render search results here */}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
