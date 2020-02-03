import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Menu,
  message,
  Modal
} from "antd";
import React, { useState } from "react";
import Link from "umi/link";
import { FormComponentProps } from "antd/es/form";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import ProTable, {
  ProColumns,
  UseFetchDataAction
} from "@ant-design/pro-table";
import CreateForm from "./components/CreateForm";
import UpdateForm, { FormValueType } from "./components/UpdateForm";
import TableForm from "./components/TableForm";
import ConnectForm from "./components/ConnectForm";
import PolymerizeForm from "./components/PolymerizeForm";
import { TableListItem } from "./data.d";
import { queryRule, updateRule, addRule, removeRule } from "./service";

interface TableListProps extends FormComponentProps {}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {
  const hide = message.loading("正在添加");
  try {
    await addRule({
      desc: fields.desc
    });
    hide();
    message.success("添加成功");
    return true;
  } catch (error) {
    hide();
    message.error("添加失败请重试！");
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading("正在配置");
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key
    });
    hide();

    message.success("配置成功");
    return true;
  } catch (error) {
    hide();
    message.error("配置失败请重试！");
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map(row => row.key)
    });
    hide();
    message.success("删除成功，即将刷新");
    return true;
  } catch (error) {
    hide();
    message.error("删除失败，请重试");
    return false;
  }
};
// 临时路由跳转
const openCreateModel = async (selectedRows: TableListItem[]) => {
  if (!selectedRows) return true;
  window.location.href = "/#/aemodel";
};

const TableList: React.FC<TableListProps> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(
    false
  );
  const [TableModalVisible, handleTableModalVisible] = useState<boolean>(false);
  const [ConnectModalVisible, handleConnectModalVisible] = useState<boolean>(
    false
  );
  const [PolymerizeModalVisible, handlePolymerizeModalVisible] = useState<
    boolean
  >(false);

  const [stepFormValues, setStepFormValues] = useState({});

  const [actionRef, setActionRef] = useState<
    UseFetchDataAction<{ data: TableListItem[] }>
  >();
  const [rowSelection] = useState<boolean>(true);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "规则名称",
      dataIndex: "name"
    },
    {
      title: "描述",
      dataIndex: "desc"
    },
    {
      title: "服务调用次数",
      dataIndex: "callNo",
      sorter: true,
      renderText: (val: string) => `${val} 万`
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: {
        0: { text: "关闭", status: "Default" },
        1: { text: "运行中", status: "Processing" },
        2: { text: "已上线", status: "Success" },
        3: { text: "异常", status: "Error" }
      }
    },
    {
      title: "上次调度时间",
      dataIndex: "updatedAt",
      sorter: true,
      valueType: "dateTime"
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            编辑
          </a>
        </>
      )
    }
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        onInit={setActionRef}
        rowKey="key"
        rowSelection={rowSelection}
        toolBarRender={(action, { selectedRows }) => [
          ,
          <Link to="/EditorFlow">
            <Button
              icon="plus"
              type="primary"
              //onClick={() => openCreateModel(true)}
            >
              添加模型
            </Button>
          </Link>,
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              handleTableModalVisible(true);
            }}
          >
            设置表组件
          </Button>,
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              handleConnectModalVisible(true);
            }}
          >
            设置连接组件
          </Button>,
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              handlePolymerizeModalVisible(true);
            }}
          >
            高级配置
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === "remove") {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          )
        ]}
        tableAlertRender={(selectedRowKeys, selectedRows) =>
          selectedRows &&
          selectedRows.length > 0 && (
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{" "}
              项&nbsp;&nbsp;
              <span>
                服务调用次数总计{" "}
                {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          )
        }
        request={params => queryRule(params)}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef!.reload();
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      <TableForm
        onSubmit={async value => {
          const success = await handleUpdate(value);
          if (success) {
            handleModalVisible(false);
          }
        }}
        onCancel={() => {
          handleTableModalVisible(false);
        }}
        TableModalVisible={TableModalVisible}
      />
      <ConnectForm
        onSubmit={async value => {
          const success = await handleUpdate(value);
          if (success) {
            handleModalVisible(false);
          }
        }}
        onCancel={() => {
          handleConnectModalVisible(false);
        }}
        ConnectModalVisible={ConnectModalVisible}
      />
      <PolymerizeForm
        onSubmit={async value => {
          const success = await handleUpdate(value);
          if (success) {
            handleModalVisible(false);
          }
        }}
        onCancel={() => {
          handlePolymerizeModalVisible(false);
        }}
        PolymerizeModalVisible={PolymerizeModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              // handleTableModalVisible(false);
              setStepFormValues({});
              actionRef!.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
