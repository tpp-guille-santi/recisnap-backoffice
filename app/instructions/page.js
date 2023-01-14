"use client";
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

export default function Home() {
  let emptyProduct = {
    id: null,
    material_name: '',
    editable: false,
    url: '',
    municipio: null,
    provincia: null,
    departamento: null,
  };

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [products, setProducts] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);



  async function getInstructions() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pages`);
      return response.data;
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async function getMaterials() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materials`);
      return response.data;
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async function deleteInstruction(instruciton) {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${instruciton.id}`);
      return true;
    } catch (e) {
      console.log(e)
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
  }, []);



  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
    setSelectedMaterial(materials[0])
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setSelectedMaterial(null);
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  }

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      else {
        _product.id = createId();
        _product.image = 'product-placeholder.svg';
        _products.push(_product);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  }

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
    setSelectedMaterial(materials.find(val => val.name === product.material_name));
  }

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  }

  const deleteProduct = async () => {
    const success = await deleteInstruction(product);
    if (!success) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product could not be deleted', life: 3000 });
      return;
    }
    let _products = products.filter(val => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }


  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  }

  const deleteSelectedProducts = async () => {
    const success = await deleteInstructions(selectedProducts);
    if (!success) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Some products could not be deleted', life: 3000 });
      return;
    }
    let _products = products.filter(val => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product['category'] = e.value;
    setProduct(_product);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  }

  const capitalizeWords = (words) => {
    if (!words) {
      return "";
    }
    return words.split(" ").map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
  }


  const materialNameBodyTemplate = (rowData) => {
    const material_name = rowData.material_name ?? '';
    return capitalizeWords(material_name);
  }

  const municipioBodyTemplate = (rowData) => {
    const municipio = rowData.municipio ?? '';
    return capitalizeWords(municipio);
  }

  const provinciaBodyTemplate = (rowData) => {
    const provincia = rowData.provincia ?? '';
    return capitalizeWords(provincia);
  }



  const departamentoBodyTemplate = (rowData) => {
    const departamento = rowData.departamento ?? '';
    return capitalizeWords(departamento);
  }



  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="w-full lg:w-auto" />
      </span>
      <div className="mt-3 md:mt-0 flex justify-content-end">
        <Button icon="pi pi-plus" className="mr-2 p-button-rounded" onClick={openNew} tooltip="New" tooltipOptions={{ position: 'bottom' }} />
        <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} tooltip="Delete" tooltipOptions={{ position: 'bottom' }} />
      </div>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
    </React.Fragment>
  );

  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  const onMaterialNameChange = (e) => {
    setProduct({ ...product, 'material_name': e.value.name });
    setSelectedMaterial(e.value);
  }


  return (
    <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
      <Toast ref={toast} />

      <div className="text-3xl text-800 font-bold mb-4">PrimeReact CRUD</div>

      <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
        <Column field="material_name" header="Material Name" body={materialNameBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="municipio" header="Municipio" body={municipioBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
        <Column field="provincia" header="Provincia" body={provinciaBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="departamento" header="Departamento" body={departamentoBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>

        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
      </DataTable>

      <Dialog visible={productDialog} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '40vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Material Name</label>
          <Dropdown id="name" value={selectedMaterial} options={materials} onChange={onMaterialNameChange} required autoFocus optionLabel="name" className={classNames({ 'p-invalid': submitted && !product.material_name })} />
          {submitted && !product.material_name && <small className="p-error">Material Name is required.</small>}
        </div>
        {/* <div className="field">
          <label htmlFor="description">Description</label>
          <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
        </div> */}

        {/* <div className="field">
          <label className="mb-3">Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div> */}

        {/* <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price">Price</label>
            <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="field col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
          </div>
        </div> */}
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete the selected products?</span>}
        </div>
      </Dialog>
    </div>
  );
}

