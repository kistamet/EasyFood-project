import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  EyeOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal} from "antd";

function Bills() {
  const [billsData, setBillsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState(null)


  // const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  // const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);


  const getAllBills = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-bills")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setBillsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);


  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
    },
    {
      title: "Tax",
      dataIndex: "tax",
    }, {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) =>
      <div className="d-flex">
        <EyeOutlined className="mx-2" onClick={()=>{}} />
      </div>
    },
  ];

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>คลังสินค้า</h3>
        <Button type="primary" onClick={() => setAddEditModalVisibilty(true)} >เพิ่มสินค้า</Button>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingItem(null)
          setAddEditModalVisibilty(false)
        }}
        visible={addEditModalVisibilty}
        title={`${editingItem !==null ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}`}
        footer={false}
        >
        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Bills