import React from 'react';

const PageNotFound = () => {
    return (
        <div className='page-not-found'>
            <div id='title'>Sorry, couldn't find what you are looking for!</div>
            <div className='circles'>
                <p>404<br />
                    <small>PAGE NOT FOUND</small>
                </p>
                <span className='circle big'></span>
                <span className='circle med'></span>
                <span className='circle small'></span>
            </div>
        </div>
    );
};

export { PageNotFound };