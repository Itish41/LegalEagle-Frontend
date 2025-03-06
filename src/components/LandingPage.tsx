import React from 'react';
import '../index.css';
import { motion } from 'framer-motion';
import { 
  // Search, 
  // Upload, 
  Shield, 
  Clock, 
  // FileCheck, 
  Zap, 
  Code,
  ArrowRight,
  // Rocket,
  Target,
  Layers,
  Database,
  Cpu,
  Lock,
  // CheckCircle
} from 'lucide-react';
import InnovationShowcaseSection from './InnovationShowcaseSection';
import TechnologyTimelineSection from './TechnologyTimelineSection';
import ClientImpactSection from './ClientImpactSection';

// import DocumentAnalysisContainer from './DocumentAnalysisContainer';
// import SearchBar from './SearchBar';

// Reusable animation variants
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

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { 
//     opacity: 1,
//     transition: {
//       delayChildren: 0.2,
//       staggerChildren: 0.1
//     }
//   }
// };

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

const FeatureCard: React.FC<{
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

const BenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div 
    variants={itemVariants}
    className="
      bg-[#1C1C1C] 
      border 
      border-gray-800 
      rounded-2xl 
      p-8 
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
        from-blue-500 
        to-green-500 
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

const IntroductionSection: React.FC = () => (
  <motion.section 
    variants={appleScrollVariants}
    initial="hidden"
    whileInView="visible"
    exit="exit"
    viewport={{ amount: 0.1 }}
    className="
      bg-[#1C1C1C] 
      border 
      border-gray-800 
      rounded-3xl 
      p-16 
      mb-20 
      text-center 
      relative 
      overflow-hidden
    "
  >
    <h1 className="
      text-5xl 
      md:text-6xl 
      lg:text-7xl 
      font-extrabold 
      text-transparent 
      bg-clip-text 
      bg-gradient-to-r 
      from-green-400 
      to-blue-600 
      mb-6 
      leading-tight
      tracking-tight
    ">
      Intelligent Document Management
    </h1>
    <p className="
      text-xl 
      md:text-2xl 
      text-gray-300 
      max-w-3xl 
      mx-auto 
      mb-10 
      px-4
      leading-relaxed
    ">
      Revolutionize your document workflow with AI-powered insights, seamless search, and intelligent analysis.
    </p>
  </motion.section>
);

const FeaturesSection: React.FC = () => {
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
        Powerful Features
      </h2>
      
      <motion.div 
        variants={appleScrollVariants}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        className="grid md:grid-cols-3 gap-8"
      >
        <FeatureCard 
          icon={<Shield size={32} />}
          title="Compliance First"
          description="Advanced AI ensures your documents meet the highest legal standards, reducing risk and ensuring regulatory compliance."
        />
        <FeatureCard 
          icon={<Clock size={32} />}
          title="Time-Saving"
          description="Automate document review processes, cutting manual analysis time by up to 80% and boosting team productivity."
        />
        <FeatureCard 
          icon={<Zap size={32} />}
          title="Instant Insights"
          description="Get immediate, actionable intelligence from complex legal documents with our state-of-the-art AI technology."
        />
      </motion.div>
    </motion.section>
  );
};

const BenefitsSection: React.FC = () => {
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
        Why Choose LegalEagle
      </h2>
      
      <motion.div 
        variants={appleScrollVariants}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        className="grid md:grid-cols-3 gap-8"
      >
        <BenefitCard 
          icon={<Target size={32} />}
          title="Precision"
          description="Leverage advanced machine learning algorithms that provide unparalleled accuracy in document analysis and risk assessment."
        />
        <BenefitCard 
          icon={<Layers size={32} />}
          title="Scalability"
          description="Effortlessly process hundreds of documents simultaneously with our robust, cloud-native infrastructure."
        />
        <BenefitCard 
          icon={<Lock size={32} />}
          title="Security"
          description="Enterprise-grade security protocols protect your sensitive legal documents with military-level encryption."
        />
      </motion.div>
    </motion.section>
  );
};

const AdvancedFeaturesSection: React.FC = () => {
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
        Advanced Capabilities
      </h2>
      
      <motion.div 
        variants={appleScrollVariants}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        className="grid md:grid-cols-3 gap-8"
      >
        <FeatureCard 
          icon={<Database size={32} />}
          title="Smart Indexing"
          description="Intelligent document categorization and indexing for lightning-fast retrieval and comprehensive analysis."
        />
        <FeatureCard 
          icon={<Cpu size={32} />}
          title="Machine Learning"
          description="Continuously evolving AI models that adapt and improve document understanding with each interaction."
        />
        <FeatureCard 
          icon={<Code size={32} />}
          title="API Integration"
          description="Seamless integration capabilities to embed our AI-powered document analysis into your existing tech ecosystem."
        />
      </motion.div>
    </motion.section>
  );
};

// import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#121212] text-white pb-32"
    >
      <div className="max-w-7xl mx-auto py-12">
        {/* Hero Section */}
        <motion.section 
          variants={appleScrollVariants}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ amount: 0.1 }}
          className="text-center mb-30 py-10"
        >
          <motion.div 
            variants={appleScrollVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15 
              }}
              className="
                bg-gradient-to-br 
                from-green-500 
                to-blue-500 
                bg-clip-text 
                text-transparent 
                font-extrabold 
                text-6xl 
                md:text-7xl 
                mb-8 
                tracking-tighter 
                leading-tight
              "
            >
              Legal Compliance, 
              <br />
              Simplified & Supercharged
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="
                text-gray-400 
                text-2xl 
                max-w-4xl 
                mx-auto 
                mb-12 
                leading-relaxed 
                tracking-tight
              "
            >
              Elevate your legal document management with cutting-edge AI. 
              Reduce complexity, accelerate insights, and make smarter decisions 
              in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center space-x-6"
            >
              <motion.button 
                onClick={() => window.location.href='/document'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  btn-primary 
                  px-10 
                  py-4 
                  rounded-xl 
                  text-lg 
                  font-bold 
                  flex 
                  items-center 
                  space-x-3 
                  shadow-2xl 
                  hover:scale-105 
                  transition-transform
                "
              >
                Get Started
                <ArrowRight size={24} className="ml-2" />
              </motion.button>
              <motion.button 
                              onClick={() => window.location.href='/compliance'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  border-2 
                  border-gray-800 
                  text-white 
                  px-10 
                  py-4 
                  rounded-xl 
                  text-lg 
                  font-bold 
                  hover:bg-gray-800 
                  transition-colors 
                  flex 
                  items-center 
                  space-x-3
                "
              >
                Compliance Rules
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Search and Upload Section */}
        {/* <SearchAndUploadSection /> */}

        <TechnologyTimelineSection/>

        {/* Features Section */}
        <FeaturesSection />

        <ClientImpactSection/>

        <InnovationShowcaseSection/>


        {/* Benefits Section */}
        <BenefitsSection />

        {/* Introduction Section */}
        <IntroductionSection />

        {/* Advanced Features Section */}
        <AdvancedFeaturesSection />
      </div>
    </motion.div>
  );
};

export default LandingPage;
