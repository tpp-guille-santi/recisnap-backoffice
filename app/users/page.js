"use client";
import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get(
        "https://peaceful-refuge-34158.herokuapp.com/users"
      );
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

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
          field="id"
          header="ID"
          sortable
          style={{ minWidth: "8rem" }}
        ></Column>
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
          header="Acciones"
          exportable={false}
          style={{ minWidth: "8rem" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default UsersPage;
