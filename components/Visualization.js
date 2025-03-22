'use client'

import { fetchWithAuth } from '@/utils/herokuapi';
import React, { useState, useEffect, useCallback } from 'react';
import { FiDownload, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import Image from 'next/image';
import { BarChart2 } from 'lucide-react';

const FLASK_API_SERVER = process.env.NEXT_PUBLIC_FLASK_API_SERVER || 'http://localhost:5001';

const Visualization = ({ summary, goal, sessionId, initialVisualization = null }) => {
  const [visualization, setVisualization] = useState(initialVisualization);
  const [modificationHistory, setModificationHistory] = useState([]);
  const [modificationInstruction, setModificationInstruction] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModification, setSelectedModification] = useState(null);
  const [previousVisualization, setPreviousVisualization] = useState(null);
  const [showModificationOnError, setShowModificationOnError] = useState(false);

  const fetchVisualizationHistory = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/sessions/${sessionId}/visualizations`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        const matchedVisualization = data.find(viz => viz.goal.question === goal.question);
        if (matchedVisualization) {
          setVisualization(matchedVisualization);
          setModificationHistory(matchedVisualization.modification_history || []);
          setIsGenerating(false);
        } else {
          await generateVisualization();
        }
      } else {
        await generateVisualization();
      }
    } catch (err) {
      console.error('Error fetching visualization history:', err);
      await generateVisualization();
    }
  }, [goal, sessionId]);

  useEffect(() => {
    if (goal && sessionId) {
      setVisualization(null);
      setPreviousVisualization(null);
      setError(null);
      fetchVisualizationHistory();
    }
  }, [goal, sessionId, fetchVisualizationHistory]);

  const generateVisualization = async (instruction = '') => {
    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    setShowModificationOnError(false);
    try {
      const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary, goal, sessionId, instruction }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'No visualizations were generated') {
          throw new Error('Sorry, no visualizations could be generated. You can try modifying the request below.');
        }
        throw new Error(data.error || 'Failed to generate visualization');
      }

      setPreviousVisualization(visualization);
      setVisualization(data);
      setModificationHistory(data.modification_history || []);
    } catch (err) {
      setError(err.message);
      setShowModificationOnError(true);
      if (visualization) {
        setPreviousVisualization(visualization);
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleModification = async () => {
    if (!modificationInstruction.trim()) {
      setError('Modification instruction cannot be empty.');
      return;
    }

    await generateVisualization(modificationInstruction);
    setModificationInstruction('');
  };

  const applyHistoricalModification = async (index) => {
    setIsLoading(true);
    setError(null);
    try {
      const historyUpToIndex = modificationHistory.slice(0, index + 1);
      const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          goal,
          instruction: historyUpToIndex[historyUpToIndex.length - 1].instruction,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply historical modification');
      }

      setPreviousVisualization(visualization);
      setVisualization(data);
      setModificationHistory(data.modification_history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageData, filename) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
        <div className="card-body p-4">
        <div className="flex items-center space-x-3">
                <div className="bg-purple-700 p-2 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Dynamic Visualizations</h3>
                  <p className="text-sm text-gray-400">Insightful charts</p>
                </div>
              </div>
          {isGenerating || isLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-lg font-semibold text-primary">
                {isGenerating ? "Generating visualization..." : "Loading..."}
              </p>
            </div>
          ) : error ? (
            <>
              <div className="alert alert-error">
                <FiAlertCircle className="mr-2" />
                <span>{error}</span>
                {previousVisualization && (
                  <button className="btn btn-sm btn-outline ml-4" onClick={() => setVisualization(previousVisualization)}>
                    Revert to Previous
                  </button>
                )}
              </div>
              {showModificationOnError && (
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Modify Visualization Request</span>
                  </label>
                  <textarea
                    value={modificationInstruction}
                    onChange={(e) => setModificationInstruction(e.target.value)}
                    placeholder="Enter modification instructions to try again"
                    className="textarea textarea-bordered h-24"
                  />
                  <button
                    onClick={handleModification}
                    className="btn btn-primary mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="loading loading-spinner"></span> : 'Try Again with Modification'}
                  </button>
                </div>
              )}
            </>
          ) : visualization ? (
            <>
              <div className="relative w-full aspect-[4/3] mt-4">
                <Image
                  src={`data:image/png;base64,${visualization.raster}`}
                  alt="Visualization"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl"
                />
                <button 
                  className="btn btn-circle btn-sm absolute top-2 right-2 z-10"
                  onClick={() => downloadImage(visualization.raster, 'visualization.png')}
                >
                  <FiDownload />
                </button>
              </div>
              {visualization.code && (
                <pre className="bg-base-200 p-4 rounded mt-4 overflow-x-auto">
                  <code>{visualization.code}</code>
                </pre>
              )}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Modify Visualization</span>
                </label>
                <textarea
                  value={modificationInstruction}
                  onChange={(e) => setModificationInstruction(e.target.value)}
                  placeholder="Enter modification instructions"
                  className="textarea textarea-bordered h-24"
                />
                <button
                  onClick={handleModification}
                  className="btn btn-primary mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner"></span> : 'Apply Modification'}
                </button>
              </div>
              {modificationHistory.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Modification History</h3>
                  <div className="flex overflow-x-auto">
                    {modificationHistory.map((mod, index) => (
                      <div key={index} className="flex-shrink-0 mr-4 mb-4">
                        <div className="card w-48 bg-base-100 shadow-xl">
                          <figure className="relative">
                            <Image
                              src={`data:image/png;base64,${mod.raster}`}
                              alt={`Modification ${index + 1}`}
                              width={192}
                              height={128}
                              className="w-full h-32 object-cover cursor-pointer"
                              onClick={() => setSelectedModification({ ...mod, index })}
                            />
                            <button 
                              className="btn btn-circle btn-xs absolute top-1 right-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(mod.raster, `modification-${index + 1}.png`);
                              }}
                            >
                              <FiDownload size={12} />
                            </button>
                          </figure>
                          <div className="card-body p-2">
                            <p className="text-xs">{mod.instruction || `Modification ${index + 1}`}</p>
                            <div className="card-actions justify-end">
                              <button 
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => applyHistoricalModification(index)}
                              >
                                <FiRefreshCw />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">No visualization available.</div>
          )}
        </div>
      </div>

      {selectedModification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Modification Details</h3>
            <div className="relative">
              <Image
                src={`data:image/png;base64,${selectedModification.raster}`}
                alt="Selected Modification"
                width={800}
                height={600}
                layout="responsive"
                className="rounded-xl"
              />
              <button 
                className="btn btn-circle btn-sm absolute top-2 right-2"
                onClick={() => downloadImage(selectedModification.raster, `modification-${selectedModification.index + 1}.png`)}
              >
                <FiDownload />
              </button>
            </div>
            <p className="mt-4">{selectedModification.instruction}</p>
            <div className="mt-6 flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={() => setSelectedModification(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Visualization;