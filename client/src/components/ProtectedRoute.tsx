import React from 'react';
import {  useNavigate } from 'react-router-dom';
import Login from './Login';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {

const navigate = useNavigate();
    if (localStorage.getItem('user')) {
        return children as JSX.Element;
       
      } else if (!localStorage.getItem('user'))  {
        navigate('/login');
        return <Login/>
      }

      return <></>
};

export default ProtectedRoute;

