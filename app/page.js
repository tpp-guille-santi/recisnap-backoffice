import RouterButton from '../components/routerButton';

const Home = () => {
  return (
    <div className="block">
      <div className="flex inline h-screen">
        <div className="flex-1 flex align-items-center justify-content-center mx-6">
          <div className="flex flex-column">
            <h1>Bienvenido a Recisnap</h1>
            <h2>
              Un sitio en donde podrás encontrar información de cómo reciclar en
              tu zona, y donde podrás aportar tus conocimientos a la comunidad
            </h2>
            <p>
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
              vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
              amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
              placerat eleifend leo. Quisque sit amet est et sapien ullamcorper
              pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae,
              ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
              condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac
              dui. Donec non enim in turpis pulvinar facilisis. Ut felis.
              Praesent dapibus, neque id cursus faucibus, tortor neque egestas
              augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam
              dui mi, tincidunt quis, accumsan porttitor, facilisis luctus,
              metus
            </p>
          </div>
        </div>
        <div className="flex-1 flex align-items-center justify-content-center fill">
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <div className="flex flex-row flex-wrap gap-3">
              <RouterButton route={'/login'} label={'Ingresar'}></RouterButton>
              <RouterButton
                route={'/register'}
                label={'Registrarme'}
              ></RouterButton>
            </div>
          </div>
          <img
            src="https://cdn.britannica.com/40/93540-050-48FF9C9E/items-recycling-centre.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
