import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from "antd";

function Items() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState(null)
  const getAllItems = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/items/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    }, {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <div className="d-flex">
        <EditOutlined className="ms-2" onClick={() => {
          setEditingItem(record)
          setAddEditModalVisibilty(true)
        }} />
        <DeleteOutlined className="mx-2" />

      </div>
    },
  ];

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if(editingItem===null)
    {
      axios
      .post("/api/items/add-item", values )
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item edited successfully')
        setEditingItem(null)
        setAddEditModalVisibilty(false)
        getAllItems()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }
    else {
      axios
      .post("/api/items/edit-item", {...values , itemId : editingItem._id})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item add successfully')
        setAddEditModalVisibilty(false)
        getAllItems()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }

  }
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
        <Button type="primary" onClick={() => setAddEditModalVisibilty(true)}>Add Item</Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />
      {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingItem(null)
          setAddEditModalVisibilty(false)
        }} 
        visible={addEditModalVisibilty} 
        title={`${editingItem !==null ? 'Edit Item' : 'Add New Item'}`}
        footer={false}
        >
          <Form
            initialValues={editingItem}
            layout="vertical" onFinish={onFinish}>
            <Form.Item name='name' label='Name'>
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name='price' label='Price'>
              <Input placeholder="price" />
            </Form.Item>

            <Form.Item name='image' label='Image URL'>
              <Input placeholder="image" />
            </Form.Item>

            <Form.Item name='category' label='Category'>
              <Select>
                <Select.Option value='fruits'>fruits</Select.Option>
                <Select.Option value='vegetables'>Vegetables</Select.Option>

                <Select.Option value='meat'>Meat</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name='stock' label='Stock'>
              <Input placeholder="stock" />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">SAVE</Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Items