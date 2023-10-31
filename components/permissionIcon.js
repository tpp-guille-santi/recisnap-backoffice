import {Button} from 'primereact/button';

const PermissionIcon = (props) => {
  return (
    <Button
      className='m-1 opacity-50'
      severity={props.permission ? 'success' : 'danger'}
      rounded
      tooltip={props.tooltip}
      icon={props.icon}
      tooltipOptions={{showOnDisabled: true, position: 'bottom'}}
    ></Button>
  );
};

export default PermissionIcon;
