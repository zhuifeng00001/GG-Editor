import { Form, Input, Modal, Table, Button, Popconfirm, Row, Col, Select } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

const { Option } = Select;
const EditableContext = React.createContext();

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

export interface ConnectFormProps extends FormComponentProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  ConnectModalVisible: boolean;
  values: Partial<TableListItem>;
}

export interface ConnectFormState {
  formVals: FormValueType;
}

class EditableCell extends React.Component {
  state = {
    editing: false,
    selectList: [],
    entityNameOptions_kLevelExpand_1: [
      {
        key: "1",
        value:1,
        text:'info1'
      },
      {
        key: "2",
        value:2,
        text:'info2'
      },
      {
        key: "3",
        value:3,
        text:'info3'
      },
    ],
    entityNameOptions_kLevelExpand_2: [
      {
        key: "4",
        value:4,
        text:'info4'
      },
      {
        key: "5",
        value:5,
        text:'info5'
      },
      {
        key: "6",
        value:6,
        text:'info6'
      },
    ]
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
      //this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };


  onChange　= (value,index) => {
    // this.state.selectList.push({
    //   value
    // })
  }
  handleSelectChange = value => {
    console.log(value);
    this.form.setFieldsValue({
      selectValue: `${value}`,
    });
  };
  

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    //console.log(dataIndex)
    const { editing } = this.state;
    const { getFieldDecorator } = this.form;
    if(dataIndex=='field'){
      return (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            
            initialValue: '请选择主表字段' //record[dataIndex]
          })(
            <Select className='table-user-name-input'
            showSearch
            placeholder="请选择主表字段"
            optionFilterProp="children"
            onChange={this.onChange}
            onBlur={this.save}
            labelInValue
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >

            {
              this.state.entityNameOptions_kLevelExpand_1.map(item => (
                  <Option key={item.value} title={item.text}>{ item.text }</Option>
                ))
              }

  
            </Select>
          )}
        </Form.Item>
      ) 
    }else if(dataIndex=='operator'){
      return (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            
            initialValue: '请选择运算符' //record[dataIndex]
          })(
            <Select className='table-user-name-input'
            showSearch
            placeholder="请选择运算符"
            optionFilterProp="children"
            onChange={this.onChange}
            onBlur={this.save}
            labelInValue
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >
            <Option value="21">=</Option>
            <Option value="22">></Option>
            <Option value="23">=</Option>
  
            </Select>
          )}
        </Form.Item>
      ) 
    }else if(dataIndex=='tablefield'){
      return (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            
            initialValue: '请选择连接表字段' //record[dataIndex]
          })(
            <Select className='table-user-name-input'
            showSearch
            placeholder="请选择连接表字段"
            optionFilterProp="children"
            onChange={this.onChange}
            onBlur={this.save}
            labelInValue
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >

              {
              this.state.entityNameOptions_kLevelExpand_2.map(item => (
                  <Option key={item.value} title={item.text}>{ item.text }</Option>
                ))
              }
  
            </Select>
          )}
        </Form.Item>
      ) 
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

class ConnectForm extends Component<ConnectFormProps, ConnectFormState> {

  static defaultProps = {
    handleUpdate: () => {},
    handleConnectModalVisible: () => {},
    values: {},
  };

  constructor(props: ConnectFormProps) {
    super(props);
    this.columns = [
      {
        title: "主表字段",
        dataIndex: "field",
        editable: true,

      },
      {
        title: "运算符",
        dataIndex: "operator",
        editable: true,

      },
      {
        title: "连接表字段",
        dataIndex: "tablefield",
        editable: true,
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
          field: "ID",
          operator: "VARCHAR2",
          tablefield: "255",
        },
        // {
        //   key: "1",
        //   field: "ID12",
        //   operator: "VARCHAR212",
        //   tablefield: "25512",
        // }
      ],
      count: 2,
      entityNameOptions_kLevelExpand_3: [
        {
          key: "7",
          value:7,
          text:'左连接'
        },
        {
          key: "8",
          value:8,
          text:'右连接'
        },
        {
          key: "9",
          value:9,
          text:'全连接'
        },
      ]
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
      field: "ID13",
      operator: "VARCHAR213",
      tablefield: "25513",
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

  handleＳelectChange = value => {
    this.setState({ textArea: [value] });
    console.log(this.state.dataSource)
  };


  render() {
    const { ConnectModalVisible, onCancel: handleConnectModalVisible, values } = this.props;
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      //console.log(col)
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
        title="设置连接组件"
        visible={ConnectModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleConnectModalVisible(false, values)}
        afterClose={() => handleConnectModalVisible()}
        maskClosable={false}
        cancelText={'重置'}
        okText={'提交'}
      >
        <Form layout="vertical" >　　
          <Row>
            <Col span={7}>
              <Form.Item label="主表">
                <Input disabled value={values.name}/>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={8}>
              <Form.Item label="连接方式">
              <Select 
              showSearch
              placeholder="请选择连接方式"
              optionFilterProp="children"
              onChange={this.handleＳelectChange}
              // onBlur={this.save}
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
                {/* <Option value="1">右连接</Option>
                <Option value="2">左连接</Option>
                <Option value="3">全连接</Option> */}
              </Select>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={7}>
              <Form.Item label="连接表">
                <Input disabled value={values.desc}/>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="连接条件">
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create<ConnectFormProps>()(ConnectForm);
