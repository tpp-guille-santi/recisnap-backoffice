'use client';
import Head from 'next/head';
import { lazy } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import 'leaflet/dist/leaflet.css';
import { Steps } from 'primereact/steps';
import { Dropdown } from 'primereact/dropdown';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { app } from '../firebase-config';
import PrivateRoute from '../../components/privateRoute';
import { getStorage, getBytes, ref, uploadString } from 'firebase/storage';
import Navbar from '../../components/navbar';
import UserSession from '../../utils/userSession';
import { InputSwitch } from 'primereact/inputswitch';
import {
  createInstruction,
  updateInstruction
} from '../../utils/serverConnector';
const CustomMap = lazy(() => import('../../components/location/map'));

export default function Home() {
  let emptyInstruction = {
    id: null,
    material_name: '',
    editable: false,
    provincia: null,
    departamento: null,
    municipio: null,
    lat: null,
    lon: null,
    geo_json: {
      type: 'Point',
      coordinates: [null, null]
    }
  };

  const DEFAULT_MAP_CENTER = [-34.591371, -58.42398];

  const [preloaded, setPreloaded] = useState(false);
  const [products, setProducts] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [createStep1, setCreateStep1] = useState(true);
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [viewLocationDialog, setViewLocationDialog] = useState(false);
  setViewLocationDialog;
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [currentInstruction, setCurrentInstruction] =
    useState(emptyInstruction);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [templateMarkdown, setTemplateMarkdown] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  const getMarkdown = async file => {
    const storageRef = ref(storage, file);
    const bytes = await getBytes(storageRef);
    return new TextDecoder().decode(bytes);
  };

  const getTemplateMarkdown = async () => {
    try {
      return getMarkdown(`/markdowns/template.md`);
    } catch (e) {
      return '';
    }
  };

  const storage = getStorage(app);

  const uploadInstructionsMarkdown = async instruction => {
    try {
      const storageRef = ref(storage, `/markdowns/${instruction.id}.md`);
      await uploadString(storageRef, markdown);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const setMarkdownFromInstructions = async instruction => {
    let markdown = templateMarkdown;
    try {
      const potentialMarkdown = await getMarkdown(
        `/markdowns/${instruction.id}.md`
      );
      if (potentialMarkdown != null && potentialMarkdown.trim() !== '') {
        markdown = potentialMarkdown;
      }
    } catch (e) {
      console.log(e);
    }
    setMarkdown(markdown);
  };

  async function getInstructions() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/instructions`
      );
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async function getMaterials() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/materials`
      );
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async function deleteInstruction(instruciton) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/instructions/${instruciton.id}`
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async function deleteInstructions(instrucitons) {
    const success = await instrucitons.every(deleteInstruction);
    return success;
  }

  useEffect(() => {
    getInstructions().then(data => setProducts(data));
    getMaterials().then(data => setMaterials(data));
    getTemplateMarkdown().then(data => setTemplateMarkdown(data));
  }, []);

  const openNew = () => {
    setCurrentInstruction(emptyInstruction);
    setMarkdown(templateMarkdown);
    setProductDialog(true);
    setCreateStep1(true);
    setMarkerPosition(null);
    setPreloaded(false);
    setSelectedMaterial('');
  };

  const hideViewDialog = () => {
    setViewProductDialog(false);
    setViewLocationDialog(false);
    setMarkerPosition(null);
    setMarkdown('');
  };

  const hideDialog = () => {
    setProductDialog(false);
    setMarkdown('');
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const createProduct = async () => {
    const instruction = await createInstruction(currentInstruction);
    if (instruction === null) {
      toast.current.show({
        severity: 'Error',
        summary: 'Error',
        detail: 'Error al crear la instrucción',
        life: 3000
      });
      return;
    }
    const uploaded = uploadInstructionsMarkdown(instruction);
    if (!uploaded) {
      toast.current.show({
        severity: 'Error',
        summary: 'Error',
        detail: 'Error al crear la instrucción',
        life: 3000
      });
      return;
    }
    let _products = [...products];
    _products.push(instruction);
    setProducts(_products);
    setProductDialog(false);
    setCurrentInstruction(emptyInstruction);
    setMarkdown('');
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Instrucción creada',
      life: 3000
    });
  };

  const updateProduct = async () => {
    const success = await updateInstruction(currentInstruction.id, {
      editable: currentInstruction.editable
    });
    if (!success) {
      toast.current.show({
        severity: 'Error',
        summary: 'Error',
        detail: 'Error al actualizar la instrucción',
        life: 3000
      });
      return;
    }
    const uploaded = uploadInstructionsMarkdown(currentInstruction);
    if (!uploaded) {
      toast.current.show({
        severity: 'Error',
        summary: 'Error',
        detail: 'Error al actualizar la instrucción',
        life: 3000
      });
      return;
    }
    const product = products.find(
      product => product.id === currentInstruction.id
    );
    product.editable = currentInstruction.editable;
    setProducts(products);
    setProductDialog(false);
    setCurrentInstruction(emptyInstruction);
    setMarkdown('');
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Instrucción actualizada',
      life: 3000
    });
  };

  const saveProduct = async () => {
    if (preloaded) {
      await updateProduct();
    } else {
      await createProduct();
    }
  };

  const viewLocation = instruction => {
    setCurrentInstruction({ ...instruction });
    setViewLocationDialog(true);
  };

  const viewProduct = instruction => {
    setCurrentInstruction({ ...instruction });
    setMarkdownFromInstructions(instruction);
    setViewProductDialog(true);
  };

  const editProduct = instruction => {
    setCurrentInstruction({ ...instruction });
    setMarkdownFromInstructions(instruction);
    setCreateStep1(false);
    setProductDialog(true);
    setPreloaded(true);
    setSelectedMaterial(
      materials.find(val => val.name === instruction.material_name)
    );
  };

  const confirmDeleteProduct = product => {
    setCurrentInstruction(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    const success = await deleteInstruction(currentProduct);
    if (!success) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la instrucción',
        life: 3000
      });
      return;
    }
    let _products = products.filter(val => val.id !== currentProduct.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setCurrentInstruction(currentInstruction);
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Instrucción eliminada',
      life: 3000
    });
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = async () => {
    const success = await deleteInstructions(selectedProducts);
    if (!success) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron eliminar algunas instrucciones',
        life: 3000
      });
      return;
    }
    let _products = products.filter(val => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Instrucciones eliminada',
      life: 3000
    });
  };

  const actionBodyTemplate = rowData => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-info m-1"
          tooltip="Ver instrucciones"
          tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          onClick={() => viewProduct(rowData)}
        />
        <Button
          icon="pi pi-map-marker"
          className="p-button-rounded p-button-warning m-1"
          tooltip="Ver ubicación"
          tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          onClick={() => viewLocation(rowData)}
        />
        {(UserSession.canBlockInstructions() ||
          (UserSession.canEditInstructions() && rowData.editable)) && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success m-1"
            tooltip="Editar instrucciones"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
            onClick={() => editProduct(rowData)}
          />
        )}
        {UserSession.canDeleteInstructions() && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger m-1"
            tooltip="Eliminar instrucciones"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
            onClick={() => confirmDeleteProduct(rowData)}
          />
        )}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="w-full lg:w-auto"
        />
      </span>
      <div className="mt-3 md:mt-0 flex justify-content-end mr-8">
        {UserSession.canCreateInstructions() && (
          <Button
            icon="pi pi-plus"
            className="mr-2 p-button-rounded"
            onClick={openNew}
            tooltip="Crear instrucciones"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          />
        )}
        {UserSession.canDeleteInstructions() && (
          <Button
            icon="pi pi-trash"
            className="p-button-danger mr-2 p-button-rounded"
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || !selectedProducts.length}
            tooltip="Eliminar selección"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          />
        )}
      </div>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text mt-2"
        onClick={hideDialog}
      />
      {createStep1 ? (
        <Button
          label="Siguiente"
          icon="pi pi-arrow-right"
          className="mt-2"
          onClick={() => {
            setCurrentInstruction({
              ...currentInstruction,
              lat: markerPosition.lat,
              lon: markerPosition.lng,
              geo_json: {
                type: 'Point',
                coordinates: [markerPosition.lng, markerPosition.lat]
              }
            });
            setCreateStep1(false);
          }}
          disabled={!markerPosition}
        />
      ) : (
        <Button
          label="Guardar"
          icon="pi pi-check"
          onClick={saveProduct}
          disabled={!currentInstruction.material_name}
        />
      )}
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text  mt-2"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text  mt-2"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text  mt-2"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text  mt-2"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  const createDialog = () => {
    const step1Div = () => {
      return (
        createStep1 && (
          <div>
            <CustomMap
              center={DEFAULT_MAP_CENTER}
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
              map={map}
              setMap={setMap}
            ></CustomMap>
          </div>
        )
      );
    };
    const step2Div = () => {
      return (
        !createStep1 && (
          <div>
            <Dropdown
              className="flex flex-1 align-items-center justify-content-center capitalize my-2"
              optionLabel="name"
              value={selectedMaterial}
              options={materials}
              placeholder="Seleccione un material"
              onChange={e => {
                setSelectedMaterial(e.value);
                setCurrentInstruction({
                  ...currentInstruction,
                  material_name: e.value.name
                });
              }}
              required
              autoFocus
              disabled={preloaded}
            ></Dropdown>
            <div className="flex flex-row justify-content-end my-2">
              <label className="flex align-items-center justify-content-center m-1">
                Habilitada:{' '}
              </label>
              <InputSwitch
                className="flex align-items-center justify-content-center m-1"
                checked={currentInstruction.editable}
                onChange={e =>
                  setCurrentInstruction({
                    ...currentInstruction,
                    editable: e.value
                  })
                }
              ></InputSwitch>
            </div>
            <MDEditor
              data-color-mode="light"
              height={550}
              value={markdown}
              onChange={setMarkdown}
            />
          </div>
        )
      );
    };

    const items = [
      {
        label: 'Ubicación'
      },
      {
        label: 'Contenido'
      }
    ];
    return (
      <Dialog
        visible={productDialog}
        modal
        maximized={true}
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        {!preloaded && (
          <Steps
            model={items}
            activeIndex={createStep1 ? 0 : 1}
            className="mx-8 mb-2"
          />
        )}
        {step1Div()}
        {step2Div()}
      </Dialog>
    );
  };

  return (
    <PrivateRoute>
      <Head>
        <Link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
        integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
        crossOrigin=""
      />
      <Navbar></Navbar>
      <Toast ref={toast} />
      <div className="m-5">
        <div className="text-3xl text-800 font-bold mb-4">Instrucciones</div>

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={e => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            className="capitalize"
            field="provincia"
            header="Provincia"
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="departamento"
            header="Departamento"
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="municipio"
            header="Municipio"
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="material_name"
            header="Material"
            sortable
          ></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
      {createDialog()}

      <Dialog
        className="w-6"
        visible={viewProductDialog}
        modal
        onHide={hideViewDialog}
      >
        <MDEditor
          className="mt-1"
          data-color-mode="light"
          height={600}
          value={markdown}
          onChange={setMarkdown}
          visibleDragbar={false}
          hideToolbar={true}
          preview={'preview'}
        />
      </Dialog>

      <Dialog
        className="w-6"
        visible={viewLocationDialog}
        modal
        onHide={hideViewDialog}
      >
        <CustomMap
          center={[currentInstruction.lat, currentInstruction.lon]}
          markerPosition={[currentInstruction.lat, currentInstruction.lon]}
          map={map}
          setMap={setMap}
        ></CustomMap>
      </Dialog>

      <Dialog
        className="w-3"
        visible={deleteProductDialog}
        header="Confirmar"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3 text-4xl" />
          <span>Estás seguro de que quieres eliminar la instrucción?</span>
        </div>
      </Dialog>

      <Dialog
        className="w-3"
        visible={deleteProductsDialog}
        header="Confirmar"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3 text-4xl" />
          <span>
            Estás seguro de que quieres eliminar las instrucciones
            seleccionadas?
          </span>
        </div>
      </Dialog>
    </PrivateRoute>
  );
}
