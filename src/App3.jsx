import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [vacancies, setVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchVacancies = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://pathwayskillszone.ac.uk/find-apprenticeships/newfile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Sort: 'AgeDesc',
          DistanceInMiles: '30',
          PostedInLastNumberOfDays: '30',
          PageSize: '10',
          NationWideOnly: 'false',
          Lat: '52.4968912',
          Lon: '-2.1932634',
          PageNumber: page,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVacancies(data.vacancies || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies(currentPage);
  }, [currentPage]);

  const handlePreviousClick = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages);
  };


  const handleDetailsClick = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsDetailsPopupOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsPopupOpen(false);
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const title = vacancy.title?.toLowerCase();
    const term = searchTerm.toLowerCase();
    return title?.includes(term);
  });

  return (
    <React.Fragment>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-5 mb-5 p-2 border rounded"
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
            {filteredVacancies.map((vacancy, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-lg cursor-pointer" onClick={() => handleDetailsClick(vacancy)}>
                <h2 className="font-bold text-lg">{vacancy.title}</h2>
                <p className="text-gray-600">{vacancy.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-600 mt-2">Employer: {vacancy.employerName}</p>
              </div>
            ))}
            
            </div>
            <div className="flex justify-between w-full mt-5">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
                onClick={handlePreviousClick}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={currentPage === totalPages}
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      
      {isDetailsPopupOpen && selectedVacancy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={handleCloseDetails}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseDetails} className="absolute top-0 right-0 mt-4 mr-4">
              <span className="text-gray-600 hover:text-gray-900">&times;</span>
            </button>
            <h3 className="text-lg font-medium text-gray-900">{selectedVacancy.title}</h3>
            <div className="mt-2">
              <p><strong>Description:</strong> {selectedVacancy.description}</p>
              <p><strong>Employer:</strong> {selectedVacancy.employerName}</p>
              <p><strong>Start Date:</strong> {selectedVacancy.startDate}</p>
              <p><strong>Closing Date:</strong> {selectedVacancy.closingDate}</p>
              <p><strong>Wage:</strong> {selectedVacancy.wage?.wageAdditionalInformation}</p>
              {/* Add more details as needed */}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default MyComponent;