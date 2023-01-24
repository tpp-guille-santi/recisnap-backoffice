"use client";
import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getUserList } from "../../utils/serverConnector";
import { Button } from "primereact/button";
import PermissionIcon from "../../components/permissionIcon.js";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
  }, []);

  async function getUsers() {
    return getUserList();
  }

  const permissionsColumnBody = (rowData) => {
    var permissions =
      rowData["permissions"] !== null ? rowData.permissions : [];
    console.log(rowData);
    console.log(permissions);
    return (
      <div>
        <PermissionIcon
          permission={permissions.includes("view_pages")}
          tooltip="Ver documento"
          icon={"pi pi-eye"}
        />
        <PermissionIcon
          permission={permissions.includes("create_page")}
          tooltip="Nuevo documento"
          icon={"pi pi-plus"}
        />
        <PermissionIcon
          permission={permissions.includes("block_page")}
          tooltip="Blockear documento"
          icon={"pi pi-stop-circle"}
        />
        <PermissionIcon
          permission={permissions.includes("edit_page")}
          tooltip="Editar documento"
          icon={"pi pi-file-edit"}
        />
        <PermissionIcon
          permission={permissions.includes("grant_permissions")}
          tooltip="Dar permisos"
          icon={"pi pi-user-edit"}
        />
        <PermissionIcon
          permission={permissions.includes("view_users")}
          tooltip="Ver usuario"
          icon={"pi pi-user"}
        />
        <PermissionIcon
          permission={permissions.includes("remove_permissions")}
          tooltip="Borrar permisos"
          icon={"pi pi-eraser"}
        />
      </div>
    );
  };

  const actionsBody = () => {
    return (
      <div>
        <Button
          className="p-button-rounded"
          icon="pi pi-pencil"
          tooltip="Editar permisos"
        />
      </div>
    );
  };

  return (
    <div>
      <DataTable
        value={users}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
      >
        <Column
          field="email"
          header="Email"
          sortable
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="name"
          header="Nombre"
          sortable
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          header="Permisos"
          sortable
          style={{ minWidth: "16rem" }}
          body={permissionsColumnBody}
        ></Column>
        <Column
          header="Acciones"
          exportable={false}
          style={{ minWidth: "8rem" }}
          body={actionsBody}
        ></Column>
      </DataTable>
    </div>
  );
};

export default UsersPage;
