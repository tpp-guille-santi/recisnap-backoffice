'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import {
  downloadInstructionsMarkdown,
  getInstructions
} from '../utils/serverConnector';
import MDEditor from '@uiw/react-md-editor';
import { Dialog } from 'primereact/dialog';
import PublicNavbar from '../components/publicNavbar';
const CustomMap = dynamic(() => import('../components/location/map'), {
  ssr: false
});

const DEFAULT_MAP_CENTER = [-34.591371, -58.42398];

export default function Home() {
  const [map, setMap] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');
  useEffect(() => {
    getInstructions().then(instructions => setInstructions(instructions));
  }, [instructions]);

  const viewProduct = async instruction => {
    setCurrentInstruction(instruction);
    const potentialMarkdown = await downloadInstructionsMarkdown(instruction);
    if (potentialMarkdown != null && potentialMarkdown.trim() !== '') {
      setMarkdown(potentialMarkdown);
    } else {
      setMarkdown(templateMarkdown);
    }
    setViewProductDialog(true);
  };

  return (
    <div className="text-center min-h-screen flex flex-col items-center justify-center">
      <Head>
        <Link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      />
      <main className="m-4 w-screen">
        <PublicNavbar showButtons={true}></PublicNavbar>
        <h1 className="mb-3 font-bold text-3xl">
          <span className="text-900">Bienvenido a Recisnap!</span>
        </h1>
        <p className="text-700 mb-6">
          ¡Gracias por ser parte de la comunidad de Recisnap y contribuir a un
          futuro más sostenible para nuestro planeta!
        </p>
        <div>
          <CustomMap
            center={DEFAULT_MAP_CENTER}
            map={map}
            setMap={setMap}
            instructions={instructions}
            style={{ height: '70vh' }}
            onMarkerClick={viewProduct}
          ></CustomMap>
        </div>
        <Dialog
          className="w-6"
          header={`Material ${currentInstruction.material_name}`}
          visible={viewProductDialog}
          modal
          onHide={setViewProductDialog}
        >
          <MDEditor
            className="mt-1"
            data-color-mode="light"
            height={400}
            width={1200}
            value={markdown}
            onChange={setMarkdown}
            visibleDragbar={false}
            hideToolbar={true}
            preview={'preview'}
          />
        </Dialog>
      </main>
    </div>
  );
}
