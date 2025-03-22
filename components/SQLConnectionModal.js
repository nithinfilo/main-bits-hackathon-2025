import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDatabase, IconX, IconLoader2 } from '@tabler/icons-react';

const SQLConnectionModal = ({ onClose, onConnect }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    host: '',
    port: '3306',
    database: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConnect(formData);
    } catch (error) {
      console.error('Error connecting to SQL database:', error);
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-base-200 p-6 rounded-lg w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-100">Connect to MySQL</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <IconX size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 text-gray-300">Username*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-gray-300">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="host" className="block mb-2 text-gray-300">Host*</label>
              <input
                type="text"
                id="host"
                name="host"
                value={formData.host}
                onChange={handleInputChange}
                placeholder='Do not include "http(s)://www."'
                className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="port" className="block mb-2 text-gray-300">Port (3306 set as default)</label>
              <input
                type="text"
                id="port"
                name="port"
                value={formData.port}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="database" className="block mb-2 text-gray-300">Database Name*</label>
              <input
                type="text"
                id="database"
                name="database"
                value={formData.database}
                onChange={handleInputChange}
                placeholder="Enter your database name"
                className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 text-gray-100 px-4 py-2 rounded hover:bg-base-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <IconLoader2 className="animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SQLConnectionModal;