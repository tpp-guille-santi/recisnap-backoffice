'use client';
import { Button } from 'primereact/button';

const PermissionIcon = props => {
  return (
    <Button
      className={`m-1 ${
        props.permission
          ? 'p-button-rounded bg-green-600 border-green-600 opacity-50'
          : 'p-button-rounded bg-red-600 border-red-600 opacity-50'
      }`}
      tooltip={props.tooltip}
      icon={props.icon}
      tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
    ></Button>
  );
};

export default PermissionIcon;
