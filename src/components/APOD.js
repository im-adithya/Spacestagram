import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { AuthContext } from '../Auth';

const APOD = ({ photoURL, description, date }) => {
  const history = useHistory();
  const stored = JSON.parse(localStorage.getItem('today'));
  const viewed = stored?.date === new Date().getDate() && stored?.month === new Date().getMonth();
  const { setFullView } = useContext(AuthContext).fv;
  return (
    <Container
      className={'w-100 apod m-0 mb-4 ' + (viewed ? '' : 'apod-new')}
      style={{
        backgroundImage:
          'linear-gradient(45deg, rgba(20, 25, 89, 0.65), rgba(222, 36, 137, 0.65)), url(' +
          photoURL +
          ')'
      }}>
      <div className="d-flex justify-content-between blur">
        <div className="d-flex flex-column align-items-start">
          <div className="text-2 mb-1" onClick={() => history.push('/apod')}>
            Astronomy Picture of the Day
          </div>
          <div>
            <div className="text-11 mb-2">
              {description.slice(0, 200) + (description.length > 200 ? '...' : '')}
            </div>
          </div>
          <button
            className="button-3"
            onClick={() => {
              localStorage.setItem(
                'today',
                JSON.stringify({ date: new Date().getDate(), month: new Date().getMonth() })
              );
              setFullView(`/p/0/${date}///${photoURL}`);
            }}>
            {'Watch ' + (viewed ? 'Again' : 'it now!')}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default APOD;
