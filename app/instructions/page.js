"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import DropdownFilter from "../../components/dropdownFilter";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { app } from "../firebase-config";
import { getStorage, getBytes, ref, uploadString } from "firebase/storage";

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

  const [preloaded, setPreloaded] = useState(false);
  const [products, setProducts] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const toast = useRef(null);
  const dt = useRef(null);



  const storage = getStorage(app);

  const getFilename = (product) => {
    return [product.provincia ?? '', product.departamento ?? '', product.municipio ?? '', product.material_name ?? ''].join('-');
  }

  const uploadInstructionsMarkdown = async () => {
    // if (!markdown) return;
    try {
      const storageRef = ref(storage, `/markdowns/${encodeURI(getFilename(product))}.md`);
      uploadString(storageRef, markdown).then((snapshot) => {
        console.log('Uploaded a raw string!');
      });
    } catch (e) {
      console.log("Error")
    }
  }

  const setMarkdownFromInstructions = async (product) => {
    try {
      const storageRef = ref(storage, `/markdowns/${encodeURI(getFilename(product))}.md`);
      const bytes = await getBytes(storageRef);
      const storedMarkdown = new TextDecoder().decode(bytes);
      setMarkdown(storedMarkdown);
    } catch (e) {
      setMarkdown('');
    }
  }

  const setMaterial = (argument) => {
    console.log(argument)
    setProduct({ ...product, 'material_name': argument.name });
  };

  const setProvincia = (argument) => {
    setProduct({ ...product, 'provincia': argument.nombre });
  };

  const setMunicipio = (argument) => {
    setProduct({ ...product, 'municipio': argument.nombre });
  };

  const setDepartamento = (argument) => {
    setProduct({ ...product, 'departamento': argument.nombre });
  };


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
    setMarkdown("")
    setProductDialog(true);
    setPreloaded(false);
  }

  const hideDialog = () => {
    setProductDialog(false);
    setMarkdown("")
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  }

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  }

  const createProduct = async () => {
    if (product.material_name && product.provincia) {
      try {
        const body = {
          "material_name": product.material_name,
          "editable": true,
          "municipio": product.municipio,
          "provincia": product.provincia,
          "departamento": product.departamento,
        }
        console.log(`product:`)
        console.log(JSON.stringify(body))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pages`, body);

        const _product = response.data;
        let _products = [...products];
        _products.push(_product);
        setProducts(_products);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      } catch (e) {
        console.log(e)
        return [];
      }
    }
  }

  const updateProduct = () => {
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
  }

  const saveProduct = async () => {
    if (preloaded) {
      updateProduct();
    }
    else {
      await createProduct();
    }
    uploadInstructionsMarkdown();
    setProductDialog(false);
    setProduct(emptyProduct);
    setMarkdown("")
  }



  const editProduct = (product) => {
    setProduct({ ...product });
    setMarkdownFromInstructions(product)
    setProductDialog(true);
    setPreloaded(true)
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


  return (
    <div>
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

        <DropdownFilter
          material={setMaterial}
          materials={materials}
          instruction={product}
          provincia={setProvincia}
          departamento={setDepartamento}
          municipio={setMunicipio}
          preloaded={preloaded}
        ></DropdownFilter>
        <MDEditor height={200} value={markdown} onChange={setMarkdown} />
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
