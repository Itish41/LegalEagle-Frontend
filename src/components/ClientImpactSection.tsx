import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Layers, 
  Lock 
} from 'lucide-react';
import CountUp from 'react-countup';

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

const ImpactCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix?: string;
  description: string;
}> = ({ icon, title, value, suffix = '', description }) => (
  <motion.div 
    variants={appleScrollVariants}
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
    <div className="text-center">
      <h3 className="
        text-2xl 
        font-bold 
        text-white 
        mb-4 
        tracking-tight
      ">
        {title}
      </h3>
      <div className="
        text-4xl 
        font-extrabold 
        gradient-text 
        mb-4
      ">
        <CountUp 
          start={0} 
          end={value} 
          duration={2.5} 
          suffix={suffix}
        />
      </div>
      <p className="
        text-gray-400 
        text-base 
        leading-relaxed
      ">
        {description}
      </p>
    </div>
  </motion.div>
);

const ClientImpactSection: React.FC = () => {
  return (
    <motion.section 
      variants={appleScrollVariants}
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
        Client Impact
      </h2>
      
      <motion.div 
        variants={appleScrollVariants}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        className="grid md:grid-cols-3 gap-8"
      >
        <ImpactCard 
          icon={<Target size={32} />}
          title="Risk Reduction"
          value={85}
          suffix="%"
          description="Decrease in legal compliance risks through advanced AI analysis."
        />
        <ImpactCard 
          icon={<Layers size={32} />}
          title="Processing Speed"
          value={80}
          suffix="%"
          description="Reduction in document review and processing time."
        />
        <ImpactCard 
          icon={<Lock size={32} />}
          title="Security Score"
          value={99}
          suffix="%"
          description="Enterprise-grade security and data protection standards."
        />
      </motion.div>
    </motion.section>
  );
};

export default ClientImpactSection;