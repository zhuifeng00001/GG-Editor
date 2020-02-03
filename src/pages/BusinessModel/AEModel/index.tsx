import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Row, Col, Form, Input, Button, Modal,message } from 'antd';
import styles from './index.less';
import TreeSearch from './TreeSearch';
import { FormComponentProps } from 'antd/es/form';
import PolymerizeForm from '../components/PolymerizeForm';
import TableForm from "../components/TableForm";
import ConnectForm from "../components/ConnectForm";
import { queryRule, updateRule, addRule, removeRule } from ".././service";
import UpdateForm, { FormValueType } from "./components/UpdateForm";

const { TextArea } = Input;


import GGEditor, { Flow } from "gg-editor";

import { formatMessage } from "umi-plugin-react/locale";
import EditorMinimap from "../../EditorFlow/components/EditorMinimap";
import { FlowContextMenu } from "../../EditorFlow/components/EditorContextMenu";
import { FlowDetailPanel } from "../../EditorFlow/components/EditorDetailPanel";
import { FlowItemPanel } from "../../EditorFlow/components/EditorItemPanel";
import { FlowToolbar } from "../../EditorFlow/components/EditorToolbar";

import Save from "../../EditorFlow/components/Save";

GGEditor.setTrackable(false);


interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

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


export default () => {
  const state = { visible: false };
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [PolymerizeModalVisible, handlePolymerizeModalVisible] = useState<boolean>(false);
  const [TableModalVisible, handleTableModalVisible] = useState<boolean>(false);
  const [ConnectModalVisible, handleConnectModalVisible] = useState<boolean>(false);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const showModal = () => {
    // this.setState({
    //   visible: true,
    // });
  };

  const handleOk = e => {
    console.log(e);
    // this.setState({
    //   visible: false,
    // });
  };

  const handleCancel = e => {
    console.log(e);
    // this.setState({
    //   visible: false,
    // });
  };
  return (
    // <Modal
    //   width={940}
    //   destroyOnClose
    //   title="新建规则"
    //   visible={modalVisible}
    //   onOk={okHandle}
    //   onCancel={() => onCancel()}
    //   maskClosable={false}
    //   cancelText={'重置1'}
    //   okText={'提交'}
    // >
    <PageHeaderWrapper 
    className={styles.main}
    content={formatMessage({
      id: "editorflow.description",
      defaultMessage: "description"
    })}
    >
      <div id="components-grid-demo-basic">
        <div>
          <Row>
            <Col span={4}>
              <TreeSearch />
            </Col>
            <Col span={1}></Col>
            <Col span={19}>
              <Form layout="inline">
                <Form.Item label="模型名称">
                  <Input placeholder="请输入模型名称" />
                </Form.Item>
                <Form.Item label="模型描述">
                  <TextArea rows={1} />
                </Form.Item>
                <Form.Item>
                    <Button
                    style={{marginRight:10}}
                    icon="plus"
                    type="primary"
                    onClick={() => {
                      handleTableModalVisible(true);
                    }}
                  >
                    设置表组件
                  </Button>
                  <Button
                    style={{marginRight:10}}
                    icon="plus"
                    type="primary"
                    onClick={() => {
                      handleConnectModalVisible(true);
                    }}
                  >
                    设置连接组件
                  </Button>
                  <Button type="primary" 
                  // onClick={showModal}
                  icon="plus"
                  onClick={() => {
                    handlePolymerizeModalVisible(true);
                  }}
                  >
                  高级配置
                  </Button>
                  {/* <Modal
                    title="Basic Modal"
                    // visible={this.state.visible}
                    // onOk={this.handleOk}
                    // onCancel={this.handleCancel}
                  >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                  </Modal> */}
                </Form.Item>
                <Form.Item>





    <GGEditor className={styles.editor}>
      <Row type="flex" className={styles.editorHd}>
        <Col span={24}>
          <FlowToolbar />
        </Col>
      </Row>
      <Row type="flex" className={styles.editorBd}>
        <Col span={4} className={styles.editorSidebar}>
          <FlowItemPanel />
        </Col>
        <Col span={16} className={styles.editorContent}>
          <Flow 
          className={styles.flow} 
          onNodeClick={(e) => {
            console.log(e);
          }}
          onEdgeClick={(e) => {
            console.log(e);
          }}
          />
          <Save />
        </Col>
        <Col span={4} className={styles.editorSidebar}>
          <FlowDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <FlowContextMenu />
    </GGEditor>
                  {/* <TextArea autoSize={true} /> */}





                </Form.Item>
              </Form>
              <Form  layout="inline">
                <Form.Item>
                <Button icon="check-circle" type="primary" 
                    onClick={() => {
                      handleTableModalVisible(true);
                    }}
                >提交</Button>
                </Form.Item>
                <Form.Item>
                <Button icon="reload" 
                    onClick={() => {
                      handleTableModalVisible(true);
                    }}
                >重置</Button>
                </Form.Item>
                </Form>
            </Col>
          </Row>
        </div>
        {/* <Spin spinning={loading} size="large"></Spin> */}
      </div>


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
    </PageHeaderWrapper>
    // </Modal>
  );
};
