import React from 'react';

export default function Wrapper(props:any) {
  return (
    <div style={{
      width: 800,
      minHeight: 300,
      background: 'rgb(199, 199, 199)',
      marginBottom: 20,
    }}>
      {props.children}
    </div>
  );
}
