import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTable, IconX } from '@tabler/icons-react';

const SQLTableSelectionModal = ({ onClose, onSelect, tables }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <IconTable className="text-blue-500 mr-2" size={24} />
              <h2 className="text-2xl font-semibold text-gray-100">Select a Table</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <IconX size={24} />
            </button>
          </div>
          <div className="mb-6">
            <ul className="divide-y divide-gray-700">
              {tables.map((table, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => onSelect(table)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 rounded transition duration-150 ease-in-out text-gray-200 hover:text-white"
                  >
                    {table}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-gray-100 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SQLTableSelectionModal;