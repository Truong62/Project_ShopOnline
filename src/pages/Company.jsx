import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Layout from '../components/Layout';
import StrategyIcon from '../components/SvgIcon/StrategyIcon';
import TechnologyIcon from '../components/SvgIcon/TechnologyIcon';
import ConsultingIcon from '../components/SvgIcon/ConsultingIcon';
import BannerCompany from '../components/SvgIcon/bannerCompany';
import { motion } from 'framer-motion';
import { STATS } from '../utils/Company/company';
import React from 'react';
import './style.scss';

const Company = () => {
  const cardVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'bottom' ? 50 : 0,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, type: 'spring' },
    },
  };

  const textFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureCardHover = {
    rest: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3, type: 'tween', ease: 'easeOut' },
    },
  };

  const renderStatsCards = () =>
    STATS.map((stat, index) => (
      <motion.div
        key={index}
        custom={stat.direction}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        className={`${
          index === 2 ? 'w-full' : 'w-[calc(50%-0.5rem)]'
        } md:w-1/3 p-8 md:p-12 text-center rounded-xl shadow-md 
        hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[#E8F7FA] to-white border border-[#A8DCE7]`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-[#A8DCE7] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {stat.title.match(/\d+/)?.[0] || '✓'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#2c7d90] mb-2">
            {stat.title}
          </h1>
          <p className="text-gray-600">{stat.description}</p>
        </div>
      </motion.div>
    ));

  const renderFeatureCards = () => (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-wrap gap-6 justify-center mt-16"
    >
      {[
        {
          icon: <StrategyIcon />,
          title: 'Strategy',
          description:
            'There are many variations of passage of Lorem Ipsum available, but the majority have suffered alteration.',
          linkText: 'Learn More',
          iconBg: 'bg-[#E8F7FA]',
          iconColor: 'text-[#2c7d90]',
        },
        {
          icon: <TechnologyIcon />,
          title: 'Technology',
          description:
            'There are many variations of passage of Lorem Ipsum available, but the majority have suffered alteration.',
          linkText: 'Learn More',
          bgStyle: 'bg-[#A8DCE7]',
          iconBg: 'bg-white',
          iconColor: 'text-[#2c7d90]',
          textColor: 'text-white',
        },
        {
          icon: <ConsultingIcon />,
          title: 'Consulting',
          description:
            'There are many variations of passage of Lorem Ipsum available, but the majority have suffered alteration.',
          linkText: 'Learn More',
          iconBg: 'bg-[#E8F7FA]',
          iconColor: 'text-[#2c7d90]',
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          variants={textFadeIn}
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={featureCardHover}
          className={`w-full md:w-[30%] px-8 py-8 rounded-xl border border-[#A8DCE7] 
          flex flex-col items-center text-center ${feature.bgStyle || 'bg-white'} 
          overflow-hidden relative`}
        >
          <div
            className={`w-16 h-16 rounded-full ${feature.iconBg || 'bg-[#E8F7FA]'} 
            flex items-center justify-center mb-6 ${feature.iconColor || ''}`}
          >
            {feature.icon}
          </div>
          <h1
            className={`font-bold text-xl mb-3 ${feature.textColor || 'text-[#2c7d90]'}`}
          >
            {feature.title}
          </h1>
          <p className={`text-sm mb-5 ${feature.textColor || 'text-gray-600'}`}>
            {feature.description}
          </p>
          <motion.a
            whileHover={{ x: 5 }}
            className={`font-medium text-base ${feature.textColor || 'text-[#2c7d90]'} 
            flex items-center group`}
            href="#"
          >
            {feature.linkText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <>
      <Header />
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[400px] overflow-hidden"
        >
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=hai%20b%C3%A0%20tr%C6%B0ng,%20h%C3%A0%20N%E1%BB%99i%20+(My%20Business%20Name)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(168,220,231,0.3)]"></div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-white bg-opacity-80 backdrop-blur-sm"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-[#2c7d90] font-bold text-2xl md:text-3xl mb-2 md:mb-0">
                Visit us and speak to <br className="hidden md:block" /> our
                team today
              </h2>
              <p className="text-gray-700 text-sm md:text-base max-w-md text-center md:text-right">
                It is a long established fact that reader will be distracted by
                the readable content of a page.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="py-16"
        >
          <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-2xl mb-16">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <BannerCompany className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(44,125,144,0.7)] to-transparent"></div>
            </motion.div>
            <motion.div
              variants={textFadeIn}
              className="absolute inset-0 flex flex-col items-start justify-center p-10 md:p-16"
            >
              <motion.h1
                variants={textFadeIn}
                className="text-white text-4xl sm:text-5xl font-bold mb-4"
              >
                Sneaker Store
              </motion.h1>
              <motion.p
                variants={textFadeIn}
                className="text-white text-lg max-w-md"
              >
                Discover our unique collection of premium sneakers and apparel
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 bg-white text-[#2c7d90] py-3 px-6 rounded-full font-medium hover:bg-[#A8DCE7] hover:text-white transition-all duration-300"
              >
                Explore Our Story
              </motion.button>
            </motion.div>
          </div>

          <motion.div variants={textFadeIn} className="text-center my-16">
            <h1 className="font-bold text-4xl text-[#2c7d90]">
              Hear our story <br /> & learn who we are
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour
            </p>
          </motion.div>

          <div className="flex flex-wrap md:flex-nowrap gap-6 my-16">
            {renderStatsCards()}
          </div>

          {renderFeatureCards()}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#E8F7FA] rounded-2xl p-10 md:p-16 mt-16 text-center"
          >
            <h2 className="text-3xl font-bold text-[#2c7d90] mb-6">
              Ready to work with us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our team today and discover how we can transform your
              business with our innovative solutions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#79c2d2' }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#A8DCE7] text-white py-3 px-8 rounded-full font-medium shadow-md transition-all duration-300"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>
      </Layout>
      <Footer />
    </>
  );
};

export default Company;
