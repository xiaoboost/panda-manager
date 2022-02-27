import React from 'react';

export * from '../shared';

interface Props {
  path: string;
}

export function Render(props: Props) {
  return <img src={props.path} height='200' />;
}
