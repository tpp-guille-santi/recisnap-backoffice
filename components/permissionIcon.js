'use client';
import { Button } from 'primereact/button';

const PermissionIcon = props => {
  return (
    <Button
      className={`m-1 ${props.permission? 'p-button-rounded p-button-success': 'p-button-rounded p-button-danger'}`}
      tooltip={props.tooltip}
      icon={props.icon}
      disabled
      tooltipOptions={{ showOnDisabled: true }}
    ></Button>
  );
};

export default PermissionIcon;
