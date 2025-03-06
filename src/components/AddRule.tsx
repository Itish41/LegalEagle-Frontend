// import React from 'react';
import { motion } from 'framer-motion';
import { useState, FormEvent, ChangeEvent } from 'react';

function AddRule() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pattern: '',
    severity: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://backend:8080/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to add rule');
      const data = await response.json();
      setMessage(`Rule ${data.name} added successfully!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#121212] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="glass-card w-full max-w-md space-y-8 p-8 rounded-xl border border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-transparent">
            Add Compliance Rule
          </h2>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {['name', 'description', 'pattern', 'severity'].map((field) => (
              <motion.input
                key={field}
                name={field}
                type="text"
                required={field === 'name'}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                whileFocus={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="
                  w-full 
                  bg-[#1C1C1C] 
                  border 
                  border-gray-800 
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
                "
              />
            ))}
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full 
              btn-primary 
              px-6 
              py-3 
              rounded-xl 
              text-lg 
              font-bold 
              flex 
              items-center 
              justify-center 
              space-x-3 
              shadow-2xl 
              transition-transform
            "
          >
            Add Rule
          </motion.button>
        </form>
        
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mt-4 
              p-4 
              rounded-xl 
              text-center 
              ${message.includes('Error') 
                ? 'bg-red-900 bg-opacity-50 text-red-300' 
                : 'bg-green-900 bg-opacity-50 text-green-300'
              }
            `}
          >
            {message}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default AddRule;
