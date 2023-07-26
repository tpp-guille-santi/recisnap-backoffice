'use client';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

const RouterButton = props => {
  const router = useRouter();

  const buttonBackgroundColor = !!props.primary ? 'bg-white' : 'bg-green-500';

  return (
    <Button
      outlined={props.primary}
      className={`flex align-items-center justify-content-center w-7rem border-round border-green-500 ml-2 ${buttonBackgroundColor} `}
      onClick={() => router.push(props.route)}
    >
      {props.label}
    </Button>
  );
};

export default RouterButton;
