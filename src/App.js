import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import debounce from 'lodash.debounce';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
library.add(fas, far);

function App() {
  async function getUsers() {
    let res = await fetch('http://127.0.0.1:3001/');
    return await res.json();
  }

  async function getUser(userName) {
    let res = await fetch(`http://127.0.0.1:3001/?term=${userName}`);
    return await res.json();
  }

  const [users, setUsers] = useState();
  const [user, setUser] = useState(null);

  const [valueSearch, setValueSearch] = useState();
  let resultSearch = [];

  const [isModal, setShowModal] = useState(false);

  if (!users) {
    getUsers()
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.log(error));
  }

  function searchStart(e) {
    resultSearch = [];
    setValueSearch(e.target.value.toLowerCase());
  }

  function search() {
    resultSearch = users.filter(elem => elem.name.toLowerCase().includes(valueSearch));
    if (resultSearch.length === 0) {
      resultSearch.push({
        name: 'Ничего не найдено',
        phone: '-',
        email: '-'
      });
    }
  };

  if (valueSearch) search();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const addUser = (data) => setUser(data);

  const showModal = name => {
    getUser(name)
      .then(data => addUser(data[0]))
      .then(() => handleShow())
      .catch(error => console.log(error));
  }

  return (
    <div className="app">
      <div className="app_search">
        <div className='app_search-container'>
          <input
            type="search"
            id="search"
            onInput={debounce(searchStart, 1000)}
          />
          {valueSearch ? null : (<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='app_icon-search' />)}
        </div>
      </div>
      <div className='app_table'>
        {users ? (resultSearch.length > 0 ? (resultSearch.map((elem, i) => {
          return (
            <Toast className='app_table-element' key={i} onClick={() => showModal(elem.name)}>
              <Toast.Header closeButton={false}><strong>{elem.name}</strong></Toast.Header>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-mobile-screen-button" className='app_icon' />{elem.phone}</Toast.Body>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-envelope" className='app_icon' />{elem.email}</Toast.Body>
            </Toast>
          )
        })) : (users.map((elem, i) => {
          return (
            <Toast className='app_table-element' key={i} onClick={() => showModal(elem.name)}>
              <Toast.Header closeButton={false}><strong>{elem.name}</strong></Toast.Header>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-mobile-screen-button" className='app_icon' />{elem.phone}</Toast.Body>
              <Toast.Body><FontAwesomeIcon icon="fa-solid fa-envelope" className='app_icon' />{elem.email}</Toast.Body>
            </Toast>
          )
        }))) : (<div>ОЙ! Что-то пошло не так... Попробуйте позже.</div>)}
      </div>
      {user ? (
        <Modal className='app_modal' show={isModal} onHide={handleClose}>
          <Modal.Header className='app_modal_header'>
            <Modal.Title className='app_modal-title'>{user.name}</Modal.Title>
            <FontAwesomeIcon icon="fa-regular fa-circle-xmark" onClick={handleClose} size="2x" className='app_modal-btnClose' />
          </Modal.Header>
          <Modal.Body className='app_modal_container'>
            <p>Телефон:</p>
            <p className='colorGrey underline'>{user.phone}</p>
            <p>Почта:</p>
            <p className='colorGrey underline'>{user.email}</p>
            <p>Дата приёма:</p>
            <p className='colorGrey'>{user.hire_date}</p>
            <p>Должность:</p>
            <p className='colorGrey'>{user.position_name}</p>
            <p>Подразделение:</p>
            <p className='colorGrey'>{user.department}</p>
          </Modal.Body>
          <Modal.Footer >
            <div>Дополнительная информация:</div>
            <div className='colorGrey'>{user.address}</div>
          </Modal.Footer>
        </Modal>
      ) : null}
    </div>
  );
}

export default App;