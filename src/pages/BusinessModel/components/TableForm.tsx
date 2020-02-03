import { Form, Input, Modal, Table } from "antd";
import React, { Component } from "react";

import { FormComponentProps } from "antd/es/form";
import { TableListItem } from "../data.d";
import NetUitl from '../../../containers/HttpUtil';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface TableFormProps extends FormComponentProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  TableModalVisible: boolean;
  values: Partial<TableListItem>;
}

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    render: text => <a>{text}</a>
  },
  {
    title: "字段名",
    dataIndex: "fieldName"
  },
  {
    title: "数据类型",
    dataIndex: "dataType"
  },
  {
    title: "长度",
    dataIndex: "length"
  },
  {
    title: "可为空",
    dataIndex: "isNull",
    render(isNull) {
      return isNull == 1 ? "YES" : "NO";
    }
  }
];
const data = [
  {
    key: "1",
    index: 1,
    fieldName: "Name",
    dataType: "VARCHSR2",
    length: 255,
    isNull: 2
  },
  {
    key: "2",
    index: 2,
    fieldName: "INFO1",
    dataType: "VARCHSR2",
    length: 255,
    isNull: 1
  },
  {
    key: "3",
    index: 3,
    fieldName: "Name",
    dataType: "VARCHSR2",
    length: 32,
    isNull: 2
  },
  {
    key: "4",
    index: 4,
    fieldName: "TYPE",
    dataType: "VARCHSR2",
    length: 255,
    isNull: 1
  }
];

// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(
//       `selectedRowKeys: ${selectedRowKeys}`,
//       "selectedRows: ",
//       selectedRows
//     );
//     // let ids: any[] = [];
//     // if (selectedRows) {
//     //   selectedRows.map((item: any) => {
//     //     ids.push(item.index);
//     //   });
//     // }
//     // console.log(ids);
//   },
//   getCheckboxProps: record => ({
//     disabled: record.name === "Joe Black", // Column configuration not to be checked
//     name: record.name
//   })
// };

export interface TableFormState {
  formVals: FormValueType;
}

class TableForm extends Component<TableFormProps, TableFormState> {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    selectedRows:　[],
    loading: false,
  };
  static defaultProps = {
    handleUpdate: () => {},
    handleTableModalVisible: () => {},
    values: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  constructor(props: TableFormProps) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: "0",
        template: "0",
        type: "1",
        time: "",
        frequency: "month"
      }
    };
  }

  okHandle = () => {
    alert("========>提交表单数据:");
    console.log(this.state.selectedRows);

  };

  onSelectChange = (selectedRowKeys,selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    console.log('selectedRows changed: ',selectedRows)
    this.setState({ selectedRowKeys,selectedRows });
  };

  render() {
    const {
      TableModalVisible,
      onCancel: handleTableModalVisible,
      values
    } = this.props;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Modal
        width={740}
        destroyOnClose
        title="设置表组件"
        visible={TableModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleTableModalVisible(false, values)}
        afterClose={() => handleTableModalVisible()}
        maskClosable={false}
        cancelText={"重置"}
        okText={"保存"}
      >
        <Form layout="vertical">
          <Form.Item label="标题">
            <Input disabled value={values.name} />
          </Form.Item>
          <Form.Item label="表名schema">
            <Input disabled value={values.desc} />
          </Form.Item>
          <Form.Item label="请选择你想要的字段">
            {/* <div className={styles.container}> */}
            <div id="components-table-demo-row-selection">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                size="small"
              />
            </div>
            {/* </div> */}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<TableFormProps>()(TableForm);
