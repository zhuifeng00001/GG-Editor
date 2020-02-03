import { Form, Input, Modal, Row, Col, Tree, Button } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const { TreeNode } = Tree;
const { Search } = Input;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props;
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const handleSubmit = () => {
    // e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  
  return (
    <Modal
      width={940}
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
      maskClosable={false}
      cancelText={'重置1'}
      okText={'提交'}
    >
      <Row>
        <Col span={6}>
          <Search placeholder="请输入关键字搜索" onSearch={value => console.log(value)} enterButton />
          <Tree defaultExpandedKeys={['0-0-0', '0-0-1', '0-0-2']}>
              <TreeNode title="数据主题域" key="0-0">
                <TreeNode title="车辆信息主题集" key="0-0-0">
                  <TreeNode title="车辆信息表" key="0-0-0-0" />
                  <TreeNode title="车辆部件表" key="0-0-0-1" />
                  <TreeNode title="出厂信息表" key="0-0-0-2" />
                  <TreeNode title="车检信息表" key="0-0-0-3" />
                </TreeNode>
                <TreeNode title="车主出行主题集" key="0-0-1">
                </TreeNode>
                <TreeNode title="路况信息主题集" key="0-0-2">
                </TreeNode>
              </TreeNode>
            </Tree>
        </Col>
        <Col span={1}></Col>
        <Col span={17}>
          <Form layout="inline" onSubmit={handleSubmit}>
            <Row>
              <Col span={14}>
                <Form.Item label="模型名称">
                  {form.getFieldDecorator('desc', {
                    rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 1 }],
                  })(<Input placeholder="请输入模型名称" style={{ width: '65%', marginRight: '3%' }} />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item>
                  <Button type="primary">
                  模型描述
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary">
                  高级配置
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <TextArea autoSize={true} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
    
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
