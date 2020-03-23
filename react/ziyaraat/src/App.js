import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Login from './auth/login'
import { Navbar, Nav } from 'react-bootstrap';
import { BrotherList } from './brothers/BrotherList';
import { ListIcon, MapIcon } from './common/Icons';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar bg='dark' style={{ height: '50px' }}>

        </Navbar>
        {/* <Login /> */}
        <Nav variant="tabs">
          <Nav.Item>
            {/* <Nav.Link href="/home">Active</Nav.Link> */}
            {/* <i className='glyphicon glyphicon-list'></i>
             */}

            <Nav.Link> <ListIcon></ListIcon> List</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            {/* <Nav.Link eventKey="link-1">Option 2</Nav.Link> */}
            <Nav.Link> <MapIcon></MapIcon> Map</Nav.Link>

          </Nav.Item>
        </Nav>
        <BrotherList />
      </Router>
    </div>
  );
}

export default App;
