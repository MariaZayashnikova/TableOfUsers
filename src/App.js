import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';
import './App.css';
library.add(fas);

function App() {
  async function getdata() {
    let res = await fetch('http://127.0.0.1:3001/');
    return await res.json();
  }

  const [users, setUsers] = useState();

  if (!users) {
    getdata()
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.log(error));
  }
  console.log(users);

  function searchStart(e) {
    // fetchDialoguesFromDatabase()
    // resultSearch = []
    // setValueSearch(e.target.value.toLowerCase())
  }
  return (
    <div className="app">
      <div className="app_search">
        <div className='app_search-container'>
          <input
            type="search"
            id="search"
          // onInput={debounce(searchStart, 1000)}
          />
          <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='app_icon-search' />
        </div>
      </div>
      <div className='app_table'>
        {users ? (users.map(elem => {
          return (
            <Toast className='app_table-element' key={elem.phone}>
              <Toast.Header closeButton={false}><strong>{elem.name}</strong></Toast.Header>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-mobile-screen-button" className='app_icon' />{elem.phone}</Toast.Body>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-envelope" className='app_icon' />{elem.email}</Toast.Body>
            </Toast>
          )
        })) : null}
      </div>
    </div>
  );
}

export default App;
