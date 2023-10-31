'use client';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import 'leaflet/dist/leaflet.css';
import { Steps } from 'primereact/steps';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import PrivateRoute from '../../components/privateRoute';
import Navbar from '../../components/navbar';
import { InputSwitch } from 'primereact/inputswitch';
import {
  createInstruction,
  deleteInstruction,
  deleteInstructions,
  downloadInstructionsMarkdown,
  downloadTemplateMarkdown,
  getInstructions,
  getMaterials,
  updateInstruction,
  uploadInstructionsMarkdown
} from '../../utils/serverConnector';
import {
  canBlockInstructions,
  canCreateInstructions,
  canDeleteInstructions,
  canEditInstructions
} from '../../utils/userSession';
const CustomMap = dynamic(() => import('../../components/location/map'), {
  ssr: false
});

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
  const [templateMarkdown, setTemplateMarkdown] = useState();
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  const setMarkdownFromInstructions = async instruction => {
    const potentialMarkdown = await downloadInstructionsMarkdown(instruction);
    if (potentialMarkdown != null && potentialMarkdown.trim() !== '') {
      setMarkdown(potentialMarkdown);
    } else {
      setMarkdown(templateMarkdown);
    }
  };

  useEffect(() => {
    getInstructions().then(data => setProducts(data));
    getMaterials().then(data => setMaterials(data));
    downloadTemplateMarkdown().then(data => setTemplateMarkdown(data));
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
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear la instrucción',
        life: 3000
      });
      return;
    }
    const uploaded = await uploadInstructionsMarkdown(instruction, markdown);
    if (!uploaded) {
      toast.current.show({
        severity: 'error',
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
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar la instrucción',
        life: 3000
      });
      return;
    }
    const uploaded = await uploadInstructionsMarkdown(
      currentInstruction,
      markdown
    );
    if (!uploaded) {
      toast.current.show({
        severity: 'error',
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

  const viewProduct = async instruction => {
    setCurrentInstruction({ ...instruction });
    await setMarkdownFromInstructions(instruction);
    setViewProductDialog(true);
  };

  const editProduct = async instruction => {
    setCurrentInstruction({ ...instruction });
    await setMarkdownFromInstructions(instruction);
    setCreateStep1(false);
    setProductDialog(true);
    setPreloaded(true);
    setSelectedMaterial(
      materials.find(val => val.name === instruction.material_name)
    );
  };

  const confirmDeleteProduct = instruction => {
    setCurrentInstruction(instruction);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    const success = await deleteInstruction(currentInstruction);
    if (!success) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la instrucción',
        life: 3000
      });
      return;
    }
    let _products = products.filter(val => val.id !== currentInstruction.id);
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
          className="m-1"
          severity="info"
          rounded
          tooltip="Ver instrucciones"
          tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          onClick={() => viewProduct(rowData)}
        />
        <Button
          icon="pi pi-map-marker"
          className="m-1"
          severity="warning"
          rounded
          tooltip="Ver ubicación"
          tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          onClick={() => viewLocation(rowData)}
        />
        {(canBlockInstructions() ||
          (canEditInstructions() && rowData.editable)) && (
          <Button
            icon="pi pi-pencil"
            className="m-1"
            severity="success"
            rounded
            tooltip="Editar instrucciones"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
            onClick={() => editProduct(rowData)}
          />
        )}
        {canDeleteInstructions() && (
          <Button
            icon="pi pi-trash"
            className="m-1"
            severity="danger"
            rounded
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
        {canCreateInstructions() && (
          <Button
            icon="pi pi-plus"
            className="mr-2"
            severity="success"
            rounded
            onClick={openNew}
            tooltip="Crear instrucciones"
            tooltipOptions={{ showOnDisabled: true, position: 'bottom' }}
          />
        )}
        {canDeleteInstructions() && (
          <Button
            icon="pi pi-trash"
            className="mr-2"
            severity="danger"
            rounded
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
        className="mt-2"
        severity="secondary"
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
        label="Cancelar"
        icon="pi pi-times"
        className="mt-2"
        severity="secondary"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Eliminar"
        icon="pi pi-check"
        className="mt-2"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="mt-2"
        severity="secondary"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Eliminar"
        icon="pi pi-check"
        className="mt-2"
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
              style={{ height: '65vh' }}
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
            filter
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="departamento"
            header="Departamento"
            filter
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="municipio"
            header="Municipio"
            filter
            sortable
          ></Column>
          <Column
            className="capitalize"
            field="material_name"
            header="Material"
            filter
            sortable
          ></Column>
          <Column body={actionBodyTemplate} exportable={false}></Column>
        </DataTable>
      </div>
      {createDialog()}

      <Dialog
        className="w-6"
        header={`Material ${currentInstruction.material_name}`}
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
          style={{ height: '65vh' }}
        ></CustomMap>
      </Dialog>

      <Dialog
        className="w-6"
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
        className="w-6"
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
