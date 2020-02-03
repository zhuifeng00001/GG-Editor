import { Form, Input, Modal, Table, Button, Popconfirm, Select } from "antd";
import React, { Component } from "react";

import { FormComponentProps } from "antd/es/form";
import { TableListItem } from "../data.d";

const EditableContext = React.createContext();
const { TextArea } = Input;
const { Option } = Select;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface PolymerizeFormProps extends FormComponentProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  PolymerizeModalVisible: boolean;
  values: Partial<TableListItem>;
}

export interface PolymerizeFormState {
  formVals: FormValueType;
}

class EditableCell extends React.Component {
  state = {
    editing: false,
    entityNameOptions_kLevelExpand_3: [
      {
        value:1,
        text:'max'
      },
      {
        value:2,
        text:'min'
      },
      {
        value:3,
        text:'mandom'
      },
    ],
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  onChange　= (value,index) => {
    console.log(value)
    // this.state.selectList.push({
    //   value
    // })
  }

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    console.log(dataIndex)
    const { editing } = this.state;
    if(dataIndex=='function'){
      return (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            
            initialValue: '请选择函数' //record[dataIndex]
          })(
            <Select className='table-user-name-input'
            showSearch
            placeholder="请选择函数"
            optionFilterProp="children"
            onChange={this.onChange}
            labelInValue
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >

            {
              this.state.entityNameOptions_kLevelExpand_3.map(item => (
                  <Option key={item.value} title={item.text}>{ item.text }</Option>
                ))
              }
  
            </Select>
          )}
        </Form.Item>
      ) 
    }else{
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title} is required.`
              }
            ],
            initialValue: record[dataIndex]
          })(
            <Input
              ref={node => (this.input = node)}
              onPressEnter={this.save}
              onBlur={this.save}
            />
          )}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );

    }
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class PolymerizeForm extends Component<
  PolymerizeFormProps,
  PolymerizeFormState
> {
  static defaultProps = {
    handleUpdate: () => {},
    handlePolymerizeModalVisible: () => {},
    values: {}
  };

  // formLayout = {
  //   labelCol: { span: 7 },
  //   wrapperCol: { span: 13 },
  // };

  constructor(props: PolymerizeFormProps) {
    super(props);
    this.columns = [
      {
        title: "序号",
        dataIndex: "id",
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        }
      },
      {
        title: "字段名",
        dataIndex: "name"
      },
      {
        title: "数据类型",
        dataIndex: "type"
      },
      {
        title: "长度",
        dataIndex: "length"
      },
      {
        title: "所属表名",
        dataIndex: "tablename"
      },
      {
        title: "函数",
        dataIndex: "function",
        editable: true
      },
      {
        title: "别名",
        dataIndex: "alias",
        editable: true
      },
      {
        title: "表达式",
        dataIndex: "expression",
        editable: true
      },
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="确定要删除？"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      dataSource: [
        {
          key: "0",
          name: "ID",
          type: "VARCHAR2",
          length: "255",
          tablename: "table1",
          function: "table1",
          alias: "table1",
          expression: "table1"
        },
        {
          key: "1",
          name: "NAME",
          type: "VARCHAR2",
          length: "255",
          tablename: "table1",
          function: "table1",
          alias: "table1",
          expression: "table1"
        }
      ],
      count: 2
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      type: "VARCHAR2",
      length: "255",
      tablename: "table1",
      function: "table1",
      alias: "table1",
      expression: "table1"
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
    console.log(this.state.dataSource)
  };

  okHandle = () => {
    alert('111');
    console.log(this.state)

  };

  onChange = ({ target: { value } }) => {
    this.setState({ textArea: [value] });
    console.log(value)
    console.log(this.state.dataSource)
  };

  render() {
    const {
      PolymerizeModalVisible,
      onCancel: handlePolymerizeModalVisible,
      values
    } = this.props;
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    return (
      <Modal
        width={1000}
        destroyOnClose
        title="高级配置"
        visible={PolymerizeModalVisible}
        onOk={this.okHandle}
        onCancel={() => handlePolymerizeModalVisible(false, values)}
        afterClose={() => handlePolymerizeModalVisible()}
        maskClosable={false}
        cancelText={"重置"}
        okText={"提交"}
      >
        <Form layout="vertical">
          <Form.Item>
            <div id="components-table-demo-edit-cell">
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{ marginBottom: 16 }}
              >
                新增字段
              </Button>
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <div style={{ marginBottom: 10 }}>where条件配置</div>
            <TextArea rows={4} 
            onChange={this.onChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<PolymerizeFormProps>()(PolymerizeForm);
