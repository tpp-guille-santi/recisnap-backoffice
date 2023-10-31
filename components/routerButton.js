import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

const RouterButton = props => {
  const router = useRouter();

  return (
    <Button
      outlined={props.primary}
      className={`flex align-items-center justify-content-center w-7rem ml-2`}
      onClick={() => router.push(props.route)}
    >
      {props.label}
    </Button>
  );
};

export default RouterButton;
