"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart2, Database, Target, Brain, FileSpreadsheet, ChevronLeft, ChevronRight, Activity, PieChart, Zap, LineChart, ScatterChart, TrendingUp } from "lucide-react"
import { WobbleCard } from "./ui/wobble-card"

const FeatureGrid = () => {
  const [selectedGoal, setSelectedGoal] = useState(1)
  const [isAutoCycling, setIsAutoCycling] = useState(true)
  const [showAllVisualizations, setShowAllVisualizations] = useState(false)

  const importData = [
    { id: 1, port: "JAPAN", currency: "USD", quantity: 1650, value: 726 },
    { id: 2, port: "MALAYSIA", currency: "USD", quantity: 3200, value: 1320 },
    { id: 3, port: "AUSTRALIA", currency: "USD", quantity: 200, value: 200 },
  ]

  const goals = [
    "What are the top 10 suppliers by the total assessed value in USD?",
    "How does the total declared value in USD vary across different types of Bill of Entry?",
    "What is the distribution of quantities of imported products?",
    "How do the customs duty, sales tax, and income tax amounts compare for different importers?",
  ]

  const visualizations = [
    { icon: <BarChart2 className="w-24 h-24 text-purple-400" />, name: "Bar chart" },
    { icon: <LineChart className="w-24 h-24 text-purple-400" />, name: "Line chart" },
    { icon: <PieChart className="w-24 h-24 text-purple-400" />, name: "Pie chart" },
    { icon: <ScatterChart className="w-24 h-24 text-purple-400" />, name: "Scatter plot" },
    { icon: <TrendingUp className="w-24 h-24 text-purple-400" />, name: "Heatmap" },
  ]

  const analysisTypes = [
    { icon: <Activity className="w-6 h-6 text-purple-400" />, text: "Root cause analysis" },
    { icon: <BarChart2 className="w-6 h-6 text-purple-400" />, text: "Statistical analysis" },
    { icon: <Zap className="w-6 h-6 text-purple-400" />, text: "Machine learning" },
    { icon: <PieChart className="w-6 h-6 text-purple-400" />, text: "Scenario analysis" },
  ]

  useEffect(() => {
    if (isAutoCycling) {
      const interval = setInterval(() => {
        setSelectedGoal((prev) => {
          if (prev === 3) {
            return 4;
          } else if (prev === 4) {
            setIsAutoCycling(false);
            setShowAllVisualizations(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAutoCycling]);

  return (
    <section id="features" className="flex justify-center items-center w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100 py-16 lg:py-32">
      <div className="flex flex-col max-w-7xl gap-16 md:gap-20 px-4 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto font-black text-3xl lg:text-5xl tracking-tight text-center"
        >
          Transform your data with{" "}
          <span className="text-purple-400 underline whitespace-nowrap decoration-wavy underline-offset-8 decoration-purple-600">
            AI-powered analysis
          </span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <WobbleCard containerClassName="bg-gray-900 rounded-3xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-700 p-2 rounded-lg">
                    <Database className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Data Preview</h3>
                    <p className="text-sm text-gray-400">Quick look at your dataset</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm text-purple-400 border-purple-400">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700">
                    <tr>
                      {Object.keys(importData[0]).map((key) => (
                        <th key={key} className="px-4 py-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((row) => (
                      <tr key={row.id} className="border-b border-gray-700">
                        {Object.values(row).map((value, index) => (
                          <td key={index} className="px-4 py-2">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                  <span>Showing 3 out of 100 results</span>
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-outline btn-xs btn-square">
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span>Page 1 of 34</span>
                    <button className="btn btn-outline btn-xs btn-square">
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gray-900 rounded-3xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-700 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI-Powered Summary</h3>
                  <p className="text-sm text-gray-400">Instant dataset insights</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Analyze</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Discover actionable insights with ease. Analyze and interpret data,
                  uncovering trends, patterns, and correlations. Make data-driven
                  decisions confidently and quickly.
                </p>
                <h5 className="text-md font-semibold text-purple-300 mb-2">Types of analysis</h5>
                <div className="grid grid-cols-2 gap-3">
                  {analysisTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
                      {type.icon}
                      <span className="text-sm text-gray-200">{type.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gray-900 rounded-3xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-700 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Goal Selection</h3>
                  <p className="text-sm text-gray-400">Choose analysis goals</p>
                </div>
              </div>
              <div className="space-y-3">
                {goals.map((goal, index) => (
                  <label
                    key={index}
                    className={`block bg-gray-800 rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedGoal === index + 1 ? "border-2 border-purple-500" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={index + 1}
                      checked={selectedGoal === index + 1}
                      onChange={() => setSelectedGoal(index + 1)}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${selectedGoal === index + 1 ? "bg-purple-500" : "border border-gray-500"}`} />
                      <span className="text-sm text-gray-300">{goal}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gray-900 rounded-3xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-700 p-2 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Dynamic Visualizations</h3>
                  <p className="text-sm text-gray-400">Insightful charts</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-3">VISUALIZATION</h4>
                <div className="bg-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[16rem]">
                  <AnimatePresence mode="wait">
                    {showAllVisualizations ? (
                      <motion.div
                        key="all-visualizations"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                      >
                        <h5 className="text-md font-semibold text-purple-300 mb-2">Types of visualizations</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {visualizations.map((vis, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-600 rounded-lg p-2">
                              {React.cloneElement(vis.icon, { className: "w-6 h-6 text-purple-400" })}
                              <span className="text-sm text-gray-200">{vis.name}</span>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2 bg-gray-600 rounded-lg p-2">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                            <span className="text-sm text-gray-200">& more</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={selectedGoal}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {visualizations[selectedGoal - 1].icon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid