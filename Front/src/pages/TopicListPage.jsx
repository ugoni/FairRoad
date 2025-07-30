import React, { useState } from 'react';
import TopicSelector from '../components/TopicSelector';
import ExhibitionCard from '../components/ExhibitionCard';
import dummyExhibitions2 from '../data/dummyExhibitions2';
import '../css/TopicListPage.css';

function TopicListPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const exhibitionsPerPage = 10;

  const filteredExhibitions = selectedTopic
    ? dummyExhibitions2.filter(ex => ex.topic === selectedTopic)
    : [];
  const totalPages = Math.ceil(filteredExhibitions.length / exhibitionsPerPage);
  const indexOfLast = currentPage * exhibitionsPerPage;
  const indexOfFirst = indexOfLast - exhibitionsPerPage;
  const currentExhibitions = filteredExhibitions.slice(indexOfFirst, indexOfLast);

  const maxPageButtons = 5; 

  const getPageNumbers = () => {
    const start = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
    return Array.from({ length: maxPageButtons }, (_, i) => start + i).filter(p => p <= totalPages);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic]);

  return (
    <div className="mt-4">
      <TopicSelector selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />

      <div className="exhibition-grid mt-4">
        {currentExhibitions.map(exhibition => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <>
              <button className="page-button" onClick={() => handlePageChange(1)}>{'<<'}</button>
              <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
            </>
          )}

          {getPageNumbers().map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`page-button ${currentPage === num ? 'active' : ''}`}
            >
              {num}
            </button>
          ))}

          {currentPage < totalPages && (
            <>
              <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
              <button className="page-button" onClick={() => handlePageChange(totalPages)}>{'>>'}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TopicListPage;
