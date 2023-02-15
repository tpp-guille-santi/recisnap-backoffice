'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import DropdownFilter from '../../components/dropdownFilter';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { app } from '../firebase-config';
import PrivateRoute from '../../components/privateRoute';
import { getStorage, getBytes, ref, uploadString } from 'firebase/storage';
import Navbar from '../../components/navbar';

export default function Home() {
  let emptyProduct = {
    id: null,
    material_name: '',
    editable: false,
    url: '',
    municipio: null,
    provincia: null,
    departamento: null
  };

  const [preloaded, setPreloaded] = useState(false);
  const [products, setProducts] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [templateMarkdown, setTemplateMarkdown] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);

  const getMarkdown = async file => {
    const storageRef = ref(storage, file);
    const bytes = await getBytes(storageRef);
    return new TextDecoder().decode(bytes);
  };

  const getTemplateMarkdown = async product => {
    try {
      return getMarkdown(`/markdowns/template.md`);
    } catch (e) {
      return '';
    }
  };

  const storage = getStorage(app);

  const getFilename = product => {
    return [
      product.provincia ?? '',
      product.departamento ?? '',
      product.municipio ?? '',
      product.material_name ?? ''
    ].join('-');
  };

  const uploadInstructionsMarkdown = async () => {
    try {
      const storageRef = ref(
        storage,
        `/markdowns/${encodeURI(getFilename(product))}.md`
      );
      await uploadString(storageRef, markdown);
    } catch (e) {
      console.log(e);
    }
  };

  const setMarkdownFromInstructions = async product => {
    let markdown = templateMarkdown;
    try {
      const potentialMarkdown = await getMarkdown(
        `/markdowns/${encodeURI(getFilename(product))}.md`
      );
      if (potentialMarkdown != null && potentialMarkdown.trim() !== '') {
        markdown = potentialMarkdown;
      }
    } catch (e) {
      console.log(e);
    }
    setMarkdown(markdown);
  };

  const setMaterial = argument => {
    setProduct({ ...product, material_name: argument.name });
  };

  const setProvincia = argument => {
    setProduct({ ...product, provincia: argument.nombre });
  };

  const setMunicipio = argument => {
    setProduct({ ...product, municipio: argument.nombre });
  };

  const setDepartamento = argument => {
    setProduct({ ...product, departamento: argument.nombre });
  };

  async function getInstructions() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${instruciton.id}`
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
    setProduct(emptyProduct);
    setMarkdown(templateMarkdown);
    setProductDialog(true);
    setPreloaded(false);
  };

  const hideViewDialog = () => {
    setViewProductDialog(false);
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
    if (product.material_name && product.provincia) {
      try {
        const body = {
          material_name: product.material_name,
          editable: true,
          municipio: product.municipio,
          provincia: product.provincia,
          departamento: product.departamento
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages`,
          body
        );

        const _product = response.data;
        let _products = [...products];
        _products.push(_product);
        setProducts(_products);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Instrucción creada',
          life: 3000
        });
      } catch (e) {
        console.log(e);
        return [];
      }
    }
  };

  const updateProduct = async () => {
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
    uploadInstructionsMarkdown();
    setProductDialog(false);
    setProduct(emptyProduct);
    setMarkdown('');
  };

  const viewProduct = product => {
    setProduct({ ...product });
    setMarkdownFromInstructions(product);
    setViewProductDialog(true);
  };

  const editProduct = product => {
    setProduct({ ...product });
    setMarkdownFromInstructions(product);
    setProductDialog(true);
    setPreloaded(true);
  };

  const confirmDeleteProduct = product => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    const success = await deleteInstruction(product);
    if (!success) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Product could not be deleted',
        life: 3000
      });
      return;
    }
    let _products = products.filter(val => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
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
          onClick={() => viewProduct(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success m-1"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger m-1"
          onClick={() => confirmDeleteProduct(rowData)}
        />
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
      <div className="mt-3 md:mt-0 flex justify-content-end">
        <Button
          icon="pi pi-plus"
          className="mr-2 p-button-rounded"
          onClick={openNew}
          tooltip="New"
          tooltipOptions={{ position: 'bottom' }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger mr-2 p-button-rounded"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
          tooltip="Delete"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <PrivateRoute>
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
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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
      <Dialog
        visible={productDialog}
        modal
        maximized={true}
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <DropdownFilter
          material={setMaterial}
          materials={materials}
          instruction={product}
          provincia={setProvincia}
          departamento={setDepartamento}
          municipio={setMunicipio}
          preloaded={preloaded}
        ></DropdownFilter>
        <MDEditor height={600} value={markdown} onChange={setMarkdown} />
      </Dialog>

      <Dialog
        visible={viewProductDialog}
        modal
        maximized={true}
        className="p-fluid"
        onHide={hideViewDialog}
      >
        <DropdownFilter
          material={setMaterial}
          materials={materials}
          instruction={product}
          provincia={setProvincia}
          departamento={setDepartamento}
          municipio={setMunicipio}
          preloaded={preloaded}
        ></DropdownFilter>
        <MDEditor
          height={600}
          value={markdown}
          onChange={setMarkdown}
          visibleDragbar={false}
          hideToolbar={true}
          preview={'preview'}
        />
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
          {product && (
            <span>Estás seguro de que quieres eliminar la instrucción?</span>
          )}
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
          {product && (
            <span>
              Estás seguro de que quieres eliminar las instrucciones
              seleccionadas?
            </span>
          )}
        </div>
      </Dialog>
    </PrivateRoute>
  );
}
