import React, { useState } from 'react';
import { Form, Input, Upload, Button, message, Card, Row, Col, Divider, Select, DatePicker, Space, Statistic } from 'antd';
import { UploadOutlined, UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, BookOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import './UserInfo.less';

const { Option } = Select;
const { TextArea } = Input;

const UserInfo = ({ userInfo, onUpdate }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(userInfo.avatar);
  const [isEditing, setIsEditing] = useState(false);
  
  // 处理图片上传前的操作
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB！');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const imageUrl = info.file.response.url || URL.createObjectURL(info.file.originFileObj);
      setImageUrl(imageUrl);
      onUpdate({ ...userInfo, avatar: imageUrl });
    }
  };

  const handleSubmit = async (values) => {
    try {
      onUpdate({
        ...userInfo,
        ...values,
        avatar: imageUrl,
        lastUpdateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      });
      message.success('更新成功');
      setIsEditing(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  return (
    <div className="user-info">
      <Card
        title={
          <Space>
            <UserOutlined />
            个人信息
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '取消编辑' : '编辑资料'}
          </Button>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card bordered={false} className="avatar-card">
              <div style={{ textAlign: 'center' }}>
                <ImgCrop rotate>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    disabled={!isEditing}
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="avatar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div>
                        <UserOutlined />
                        <div style={{ marginTop: 8 }}>上传头像</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
                <div style={{ marginTop: 16 }}>
                  <Statistic title="学习天数" value={userInfo.studyDays || 0} suffix="天" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <Statistic title="总专注时长" value={userInfo.focusTime || 0} suffix="分钟" />
                </div>
              </div>
            </Card>
          </Col>
          <Col span={16}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ...userInfo,
                birthday: userInfo.birthday ? moment(userInfo.birthday) : null
              }}
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="昵称"
                    name="nickname"
                    rules={[{ required: true, message: '请输入昵称' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="请输入昵称" 
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="年级"
                    name="grade"
                  >
                    <Select disabled={!isEditing} placeholder="请选择年级">
                      <Option value="高一">高一</Option>
                      <Option value="高二">高二</Option>
                      <Option value="高三">高三</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="手机号"
                    name="phone"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="请输入手机号"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="邮箱"
                    name="email"
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="请输入邮箱"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="生日"
                    name="birthday"
                  >
                    <DatePicker 
                      style={{ width: '100%' }}
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="目标院校"
                    name="targetSchool"
                  >
                    <Input 
                      prefix={<BookOutlined />}
                      placeholder="输入目标院校"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item
                label="个人简介"
                name="bio"
              >
                <TextArea 
                  rows={4} 
                  placeholder="介绍一下自己吧..."
                  disabled={!isEditing}
                />
              </Form.Item>

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="完成任务" 
                    value={userInfo.completedTasks || 0} 
                    suffix="个"
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="知识点" 
                    value={userInfo.knowledgePoints || 0}
                    suffix="个"
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="平均分" 
                    value={userInfo.averageScore || 0}
                    suffix="分"
                  />
                </Col>
              </Row>

              {isEditing && (
                <Form.Item style={{display:'flex',justifyContent:'flex-end'}}>
                  <Button type="primary" htmlType="submit">
                    保存修改
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserInfo; 