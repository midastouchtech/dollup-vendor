import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const SelectedCustomer = styled.div`
  padding: 5px;
  border: 1px solid #f1f1f1;
  display: flex;
  justify-content: space-evenly;
  background: #f1f1f1;
  align-items: center;
  margin-bottom: 10px;
  button {
    padding: 5px;
    background: red;
    border: none;
    cursor: pointer;
    color: white;
  }
  h6,
  p {
    margin: 0;
    height: 100%;
    padding: 5px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;

const SearchResult = styled.div`
  padding: 5px;
  border: 1px solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    padding: 5px;
    background: skyblue;
    border: none;
    cursor: pointer;
  }
  h6,
  p {
    margin: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;
const SearchAndSelectCustomer = ({ socket, onSelect, selectedCustomer }) => {
  const [customers, setCustomers] = useState();
  const [searchTerm, setsearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSelect = (customer) => {
    onSelect(customer);
  };

  return (
    <div className='ps-section__content'>
      {selectedCustomer && (
        <SelectedCustomer>
          <h6>Selected Customer</h6>
          <p>
            {selectedCustomer.firstName} {selectedCustomer.lastName}
          </p>
          <p>{selectedCustomer.email}</p>
          <button
            onClick={() => {
              handleSelect(null);
            }}
          >
            Remove
          </button>
        </SelectedCustomer>
      )}
      <div className='ps-section__filter'>
        <div className='ps-form--search'>
          <input
            className='form-control'
            type='text'
            placeholder='Search customer by name'
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
          <button
            className='ps-btn ps-btn--gray'
            onClick={() => {
              setSearching(true);
              socket.emit('SEARCH_CUSTOMER', {
                term: searchTerm,
              });
              socket.on('RECEIVE_SEARCHED_CUSTOMER', (data) => {
                setCustomers(data);
                setsearchTerm('');
                setSearching(false);
              });
              socket.on('RECEIVE_SEARCHED_CUSTOMER_NOT_FOUND', () => {
                setCustomers([]);
                setsearchTerm('');
                setSearching(false);
              });
            }}
          >
            Search
          </button>
        </div>
      </div>
      {/* Current selected customer section */}

      {/* Search results section */}
      <div className='ps-section__content'>
        <br />

        {customers && (
          <>
            <h6>Search Results</h6>
            {customers.map((item, index) => {
              return (
                <SearchResult key={index}>
                  <h6>
                    {item.firstName} {item.lastName}
                  </h6>
                  <p>{item.email}</p>
                  <button
                    onClick={() => {
                      handleSelect(item);
                      setCustomers(null);
                      setsearchTerm('');
                    }}
                  >
                    Select
                  </button>
                </SearchResult>
              );
            })}
            {customers.length === 0 && <p>No customers found</p>}
          </>
        )}
        {searching && <p>Searching...</p>}
      </div>
    </div>
  );
};
export default SearchAndSelectCustomer;
