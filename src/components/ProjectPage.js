import React from 'react';

const Project1 = (props) => {

  console.log(props);

  return(
    <div>
      <h1>Thing I've Done!</h1>
      Showing Project {props.match.params.id}!
    </div>
  );
};

export default Project1;
