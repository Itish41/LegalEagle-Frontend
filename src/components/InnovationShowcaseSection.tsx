import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Network, 
  Shield 
} from 'lucide-react';

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

const InnovationCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div 
    variants={itemVariants}
    className="
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
      mt-20
      flex 
      flex-col 
      items-center 
      text-center
    "
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
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
      "
    >
      {icon}
    </motion.div>
    <h3 className="
      text-2xl 
      font-bold 
      text-white 
      mb-4 
      tracking-tight
    ">
      {title}
    </h3>
    <p className="
      text-gray-400 
      text-base 
      leading-relaxed
    ">
      {description}
    </p>
  </motion.div>
);

const InnovationShowcaseSection: React.FC = () => {
  return (
    <motion.section 
      variants={appleScrollVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ amount: 0.1 }}
      className="relative overflow-hidden py-24 mt-24 mb-24"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
            AI-Powered Legal Innovation
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bridging the gap between cutting-edge technology and legal expertise.
          </p>
        </motion.div>

        <motion.div 
          variants={appleScrollVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          className="grid md:grid-cols-3 gap-8"
        >
          <InnovationCard 
            icon={<Cpu size={32} />}
            title="Adaptive Learning"
            description="Machine learning models that continuously improve document understanding."
          />
          <InnovationCard 
            icon={<Network size={32} />}
            title="Interconnected Insights"
            description="Advanced correlation algorithms linking complex legal concepts."
          />
          <InnovationCard 
            icon={<Shield size={32} />}
            title="Predictive Compliance"
            description="Proactive risk assessment using advanced predictive analytics."
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InnovationShowcaseSection;