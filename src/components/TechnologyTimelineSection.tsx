import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Shield, 
  Zap 
} from 'lucide-react';

const itemVariants = {
  hidden: { 
    y: 50, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

const TimelineCard: React.FC<{
  icon: React.ReactNode;
  year: number;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, year, title, description, isActive, onClick }) => (
  <motion.div 
    variants={itemVariants}
    onClick={onClick}
    className={`
      glass-card 
      p-6 
      rounded-2xl 
      border 
      border-gray-800 
      hover:border-green-500/50 
      transition-all 
      duration-300 
      group 
      transform 
      hover:-translate-y-2 
      hover:shadow-2xl
      cursor-pointer
      ${isActive 
        ? 'bg-gradient-to-br from-green-500 to-blue-500 border-transparent' 
        : ''}
    `}
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        w-16 
        h-16 
        rounded-xl 
        bg-gradient-to-br 
        from-green-500 
        to-blue-500 
        flex 
        items-center 
        justify-center 
        text-white 
        mb-6 
        group-hover:scale-110 
        transition-transform
        shadow-lg
        ${isActive 
          ? 'bg-white text-black' 
          : ''}
      `}
    >
      {icon}
    </motion.div>
    <h3 className={`
      text-2xl 
      font-bold 
      text-white 
      mb-4 
      tracking-tight
      ${isActive 
        ? 'text-black' 
        : ''}
    `}>
      {year}
    </h3>
    <h4 className={`
      text-2xl 
      font-bold 
      text-white 
      mb-4 
      tracking-tight
      ${isActive 
        ? 'text-black' 
        : ''}
    `}>
      {title}
    </h4>
    <p className={`
      text-gray-400 
      text-base 
      leading-relaxed
      ${isActive 
        ? 'text-black' 
        : ''}
    `}>
      {description}
    </p>
  </motion.div>
);

const TechnologyTimelineSection: React.FC = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const timelineItems = [
    {
      year: 2020,
      title: "AI Document Analysis",
      description: "First-generation machine learning models for legal document parsing.",
      icon: <Code size={32} />
    },
    {
      year: 2022,
      title: "Compliance Intelligence",
      description: "Advanced risk assessment and regulatory compliance tracking.",
      icon: <Shield size={32} />
    },
    {
      year: 2024,
      title: "Predictive Insights",
      description: "Cutting-edge predictive analytics for proactive legal strategy.",
      icon: <Zap size={32} />
    }
  ];

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ amount: 0.1 }}
      className="mt-24 mb-24"
    >
      <h2 className="
        text-5xl 
        font-extrabold 
        text-center 
        mb-20 
        gradient-text 
        tracking-tighter
        leading-tight
      ">
        Our Technological Journey
      </h2>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        exit="exit"
        className="grid md:grid-cols-3 gap-8"
      >
        {timelineItems.map((item, index) => (
          <TimelineCard
            key={item.year}
            {...item}
            isActive={activeTimeline === index}
            onClick={() => setActiveTimeline(index)}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default TechnologyTimelineSection;