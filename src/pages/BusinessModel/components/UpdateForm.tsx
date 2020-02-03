import { Form, Input, Modal, Table } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const { TextArea } = Input;

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: 'ID1',
    dataIndex: 'age',
  },
  {
    title: 'NAME1',
    dataIndex: 'name',
  },
  {
    title: 'ID2',
    dataIndex: 'id',
  },
  {
    title: 'NAME2',
    dataIndex: 'address',
  },
];

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    id: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    id: 32,
    address: 'London No. 1 Lake Park',
  },
  {
    key: 3,
    name: 'Joe Black',
    age: 32,
    id: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);
    

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };
  }

  render() {
    const { updateModalVisible, onCancel: handleUpdateModalVisible, values } = this.props;
    // const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={740}
        destroyOnClose
        title="查看模型数据"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        footer={null}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="模型名称">
            <Input disabled value={values.name}/>
          </Form.Item>
          <Form.Item label="模型代码">
            <TextArea rows={4} disabled value={values.desc}/>
          </Form.Item>
          <Form.Item label="模型代码">
            <Table columns={columns} dataSource={data} size="small" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
