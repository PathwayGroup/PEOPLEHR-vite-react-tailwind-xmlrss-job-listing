import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [vacancies, setVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVacancies = async () => {
    setIsLoading(true);
    try {
      // Assuming the PHP script is hosted and accessible at "/newfile.php"
      const response = await fetch('https://pathwayskillszone.ac.uk/find-apprenticeships/newfile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include any additional parameters you might need for the PHP script
        body: JSON.stringify({
          Sort: 'AgeDesc',
          DistanceInMiles: '30',
          PostedInLastNumberOfDays: '30',
          PageSize: '10',
          NationWideOnly: 'false',
          Lat: '52.4968912',
          Lon: '-2.1932634',
        }),
      });
      console.log(response)
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVacancies(data.vacancies || []);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

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

  const renderVacancyDetails = (vacancy) => {
    return (
      <React.Fragment>
        <div>Title: {vacancy.title}</div>
        <div>Description: {vacancy.description}</div>
        <div>Employer: {vacancy.employerName}</div>
        <div>Start Date: {vacancy.startDate}</div>
        <div>Closing Date: {vacancy.closingDate}</div>
        <div>Wage: {vacancy.wage?.wageAdditionalInformation}</div>
        {/* Add more fields as needed */}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy, index) => (
            <div key={index} onClick={() => handleDetailsClick(vacancy)}>
              <h2>{vacancy.title}</h2>
              <p>{vacancy.description}</p>
              {/* Render more vacancy details as needed */}
            </div>
          ))
        ) : (
          <p>No vacancies found.</p>
        )}
      </div>
      {isDetailsPopupOpen && selectedVacancy && (
        <div onClick={handleCloseDetails}>
          <div onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseDetails}>Close</button>
            {renderVacancyDetails(selectedVacancy)}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default MyComponent;