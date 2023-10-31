import { ProgressSpinner } from 'primereact/progressspinner';

const Spinner = () => {
  return (
    <div className="fixed flex justify-content-center align-content-center bg-black-alpha-50 opacity-40 h-screen w-screen z-5">
      <ProgressSpinner
        aria-label="Loading"
        className="flex align-items-center flex-wrap justify-content-center mt-7"
      />
    </div>
  );
};

export default Spinner;
