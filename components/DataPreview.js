'use client'

import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import { Filter, ChevronLeft, ChevronRight, Database, FileSpreadsheet } from 'lucide-react'

export default function DataPreview({ datasetUrl }) {
  const [previewData, setPreviewData] = useState([])
  const [headers, setHeaders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetch-gcs-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: datasetUrl }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch file from GCS')
        }

        const { content, contentType, fileName } = await response.json()

        let parsedData
        if (contentType.includes('application/json') || fileName.toLowerCase().endsWith('.json')) {
          parsedData = await parseJSON(content)
        } else if (contentType.includes('text/csv') || fileName.toLowerCase().endsWith('.csv')) {
          parsedData = await parseCSV(content)
        } else {
          throw new Error('Unsupported file format')
        }

        setHeaders(parsedData.headers)
        setPreviewData(parsedData.data.slice(0, 100)) // Load first 100 rows
        setFilters(parsedData.headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {}))
      } catch (err) {
        console.error('Error fetching or parsing data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [datasetUrl])

  const parseJSON = async (content) => {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      return {
        headers: Object.keys(parsed[0] || {}),
        data: parsed
      }
    } else if (typeof parsed === 'object') {
      return {
        headers: Object.keys(parsed),
        data: [parsed]
      }
    }
    throw new Error('Unsupported JSON structure')
  }

  const parseCSV = (content) => {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: true,
        complete: (results) => {
          resolve({
            headers: results.meta.fields,
            data: results.data
          })
        },
        error: (error) => reject(new Error('Failed to parse CSV: ' + error.message))
      })
    })
  }

  const filteredData = useMemo(() => {
    return previewData.filter(row =>
      Object.entries(filters).every(([key, value]) => 
        value === '' || row[key]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    )
  }, [previewData, filters])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredData, currentPage])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const handleFilterChange = (header, value) => {
    setFilters(prev => ({ ...prev, [header]: value }))
    setCurrentPage(1)
  }

  const handleExport = () => {
    // Implement export functionality here
    console.log('Export functionality to be implemented')
  }

  if (isLoading) {
    return (
      <div className="bg-base-100 shadow-xl rounded-box overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-lg font-semibold text-primary">
            Loading data preview...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-base-100 shadow-xl rounded-box overflow-hidden">
        <div className="text-center py-4 text-error">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>Failed to load data preview: {error}</p>
        </div>
      </div>
    )
  }

  if (!headers || headers.length === 0 || !previewData || previewData.length === 0) {
    return <div className="text-center py-4">No data available to preview.</div>
  }

  return (
    <div className="bg-base-100 shadow-xl rounded-box overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Database className="w-6 h-6 text-primary-content" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Data Preview</h3>
              <p className="text-sm text-base-content/70">Quick look at your dataset</p>
            </div>
          </div>
          <button onClick={handleExport} className="btn btn-outline btn-sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
        <div className="bg-base-200 rounded-box p-4">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="bg-base-300">
                      <div className="flex items-center justify-between">
                        <span>{header}</span>
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-xs">
                            <Filter size={16} />
                          </label>
                          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                              <input
                                type="text"
                                placeholder="Filter..."
                                value={filters[header]}
                                onChange={(e) => handleFilterChange(header, e.target.value)}
                                className="input input-bordered input-sm w-full"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, cellIndex) => (
                      <td key={cellIndex} className="whitespace-nowrap">
                        {row[header]?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} results
            </span>
            <div className="join">
              <button
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button className="join-item btn btn-sm btn-disabled">
                Page {currentPage} of {totalPages}
              </button>
              <button
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="join-item btn btn-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}