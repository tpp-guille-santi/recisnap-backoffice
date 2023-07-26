'use client';
import RouterButton from '../components/routerButton';
import React from 'react';
import { Card } from 'primereact/card';

const Home = () => {
  return (
    <div className="text-center min-h-screen flex flex-col items-center justify-center">
      <main className="m-4">
        <div className="flex flex-row items-center justify-content-end mb-6">
          <RouterButton route={'/login'} label={'Ingresar'}></RouterButton>
          <RouterButton
            primary={true}
            route={'/register'}
            label={'Registrarme'}
          ></RouterButton>
        </div>
        <h1 className="mb-3 font-bold text-3xl">
          <span className="text-900">Bienvenido a Recisnap!</span>
        </h1>
        <p className="text-700 mb-6">
          ¡Gracias por ser parte de la comunidad de Recisnap y contribuir a un
          futuro más sostenible para nuestro planeta!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="shadow-lg rounded-lg p-4">
            <h2 className="text-2xl font-semibold">¿Cómo puedes contribuir?</h2>
            <p>
              En Recisnap, tenés la oportunidad de hacer una diferencia real en
              la promoción del reciclaje y la conciencia ambiental. Aquí es
              donde, como miembro activo de nuestra comunidad, podés aportar de
              diversas maneras:
            </p>
            <div className="grid">
              <div className="col">
                <Card title="Agregando centros de reciclaje">
                  Si conoces centros de reciclaje en tu área que aún no están en
                  nuestra base de datos, te animamos a compartir esa
                  información. De esta manera, podremos ofrecer una experiencia
                  más completa y útil para todos los usuarios de la aplicación.
                </Card>
              </div>
              <div className="col">
                <Card title="Mejorando la información">
                  Puedes escribir información sobre el reciclaje de diversos
                  materiales en diferentes niveles geográficos. Si tenés
                  conocimientos sobre el reciclaje de materiales específicos en
                  tu provincia, departamento o municipio, ¡tu aporte será muy
                  valioso para enriquecer el contenido de nuestra aplicación!
                </Card>
              </div>
            </div>
          </div>
          <div>
            <p>
              La identificación de materiales se realiza directamente desde la
              aplicación móvil de Recisnap. Nuestra aplicación utiliza un modelo
              de clasificación basado en inteligencia artificial que te permite
              tomar una foto de un objeto y obtener instrucciones claras sobre
              cómo reciclarlo adecuadamente. Cada vez que los usuarios aportan
              nuevas imágenes para la clasificación, el modelo se reentrena para
              mejorar su precisión y eficacia.
            </p>
            <p>
              ¡Tu participación es fundamental para hacer de Recisnap una
              herramienta aún más poderosa y efectiva para el reciclaje!
            </p>
            <p>
              Gracias por formar parte de este proyecto y contribuir al cuidado
              de nuestro medio ambiente.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
