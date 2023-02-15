'use client';
import { Button } from 'primereact/button';

const PermissionIcon = props => {
  return (
    <Button
      className={
        props.permission
          ? 'p-button-rounded p-button-success'
          : 'p-button-rounded p-button-danger'
      }
      tooltip={props.tooltip}
      icon={props.icon}
      disabled
      tooltipOptions={{ showOnDisabled: true }}
      style={{ marginRight: '2px' }}
    ></Button>
  );
};

export default PermissionIcon;
