'use client';
import { useRouter } from 'next/navigation';

const RouterButton = props => {
  const router = useRouter();
  return (
    <button
      className="flex align-items-center justify-content-center w-7rem border-round bg-green-500 border-green-500"
      onClick={() => router.push(props.route)}
    >
      {props.label}
    </button>
  );
};

export default RouterButton;
