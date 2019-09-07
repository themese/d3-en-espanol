import React from 'react';
import './App.css';
import { useRoutes, A } from 'hookrouter';
import Routes from './router';
import { PageNotFound } from './components/page_not_found';

const App: React.FC = () => {
  const routeResult = useRoutes(Routes);
  return (
    <div className='App'>
      <ul>
        <li><A href="/vertical">Vertical Bar Chart</A> </li>
        <li><A href="/horizontal">Horizontal Bar Chart</A></li>
        <li><A href="/contact">Contacts Page</A> <br /></li>
      </ul>
      {routeResult || <PageNotFound />}
    </div>
  );
}

export default App;
