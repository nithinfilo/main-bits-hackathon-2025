import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDatabase, IconX, IconLoader2 } from '@tabler/icons-react';

const MongoDBConnectionModal = ({ onClose, onConnect }) => {
  const [step, setStep] = useState('connection');
  const [connectionData, setConnectionData] = useState({
    uri: '',
    database: '',
  });
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/mongodb-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        const { collections } = await response.json();
        setCollections(collections);
        setStep('collection');
      } else {
        throw new Error('Failed to connect to the database');
      }
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      alert('Failed to connect to the database. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConnect({ ...connectionData, collectionName: selectedCollection });
    } catch (error) {
      console.error('Error querying MongoDB collection:', error);
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
            <h2 className="text-2xl font-semibold text-gray-100">Connect to MongoDB</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <IconX size={24} />
            </button>
          </div>
          {step === 'connection' ? (
            <form onSubmit={handleConnect}>
              <div className="mb-4">
                <label htmlFor="uri" className="block mb-2 text-gray-300">Connection URI*</label>
                <input
                  type="text"
                  id="uri"
                  name="uri"
                  value={connectionData.uri}
                  onChange={handleInputChange}
                  placeholder="mongodb://username:password@host:port"
                  className="w-full p-2 border rounded bg-base-100 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="database" className="block mb-2 text-gray-300">Database Name*</label>
                <input
                  type="text"
                  id="database"
                  name="database"
                  value={connectionData.database}
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
                  className="bg-gray-600 text-gray-100 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
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
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="collection" className="block mb-2 text-gray-300">Select Collection*</label>
                <select
                  id="collection"
                  name="collection"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a collection</option>
                  {collections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 text-gray-100 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
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
                      Querying...
                    </>
                  ) : (
                    'Query Collection'
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MongoDBConnectionModal;