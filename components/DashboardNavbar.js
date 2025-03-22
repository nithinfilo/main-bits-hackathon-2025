import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ButtonAccount from './ButtonAccount';
import {
  IconHome,
  IconBrandTwitter,
  IconCoin
} from '@tabler/icons-react';

const IconContainer = ({ mouseX, icon, href, title }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute left-1/2 -bottom-8 px-2 py-1 bg-neutral-700 text-neutral-200 text-xs rounded whitespace-nowrap"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="flex items-center justify-center w-6 h-6 text-neutral-200">
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
};

const DashboardNavbar = ({ config, logo }) => {
  const [credits, setCredits] = useState(0);
  const { data: session } = useSession();
  const mouseX = useMotionValue(Infinity);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await fetch('/api/credits');
      const data = await response.json();
      setCredits(data.credits);
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { icon: <IconHome size={20} />, href: '/dashboard', title: 'Home' },
    { icon: <IconBrandTwitter size={20} />, href: 'https://twitter.com/yourcompany', title: 'Twitter' },
  ];

  return (
    <>
      {!isVisible && (
        <div 
          className="fixed top-0 left-0 right-0 h-2 bg-transparent z-50"
          onMouseEnter={() => setIsVisible(true)}
        />
      )}
      <motion.nav

        className="fixed top-0 left-0 right-0 bg-neutral-900 shadow-lg px-4 py-2 z-40"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="relative flex-shrink-0">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>

            {navItems.map((item) => (
              <IconContainer
                key={item.title}
                mouseX={mouseX}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center bg-neutral-800 px-3 py-1 rounded-full"
            >
              <IconCoin size={16} className="text-yellow-500" />
              <span className="ml-1 text-sm font-medium text-neutral-200">{credits}</span>
            </motion.div>

            <ButtonAccount />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default DashboardNavbar;