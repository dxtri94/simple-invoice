import Head from 'next/head'
import LayoutDefault from '@/components/layout/default'
import {SITE_NAME} from '@/constants/common'
import {useRouter} from 'next/router'
import React from "react";
import {withAuth} from "@/hoc/withAuth";
import {Breadcrumb, Button, DatePicker, Divider, Form, Input, InputNumber, notification, Space} from "antd";
import {IPaginationAPI} from "@/types/pagination";
import {IInvoice} from "@/types/invoices";
import {HomeOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import styles from './Update.module.scss'

interface InvoicesProps {
  invoices?: IInvoice[];
  paging?: IPaginationAPI;
  error?: any;
  user?: any;
}

const UpdateInvoices: React.FC = ({invoices, paging, error, user}: InvoicesProps) => {
  const router = useRouter();
  const {invoiceId} = router.query

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    router.push('/invoices');
    notification.success({
      message: 'Created invoice successfully!'
    })
  };

  return (
    <LayoutDefault>
      <Head>
        <title>Update Invoice</title>
      </Head>
      <Breadcrumb
        style={{marginBottom: 10}}
        items={[
          {
            href: '/invoices',
            title: <HomeOutlined/>,
          },
          {
            href: `invoices/${invoiceId}/update`,
            title: `Update invoice ${invoiceId}`,
          },
        ]}
      />
      <div className={styles.createContainer}>
        <Form
          form={form}
          name="create_invoice"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Form.Item name="bankAccount">

            <Divider orientation="left">Bank Account</Divider>

            <Space direction="vertical" className={styles.formGroup}>
              <Form.Item
                name="bankId"
                label="Bank Id"
                rules={[{
                  required: true,
                  message: 'Please input your bank id!',
                }]}>
                <Input/>
              </Form.Item>

              <Form.Item
                name="sortCode"
                label="Bank sort code"
                rules={[{
                  required: true,
                  message: 'Please input your bank sort code!',
                }]}>
                <Input/>
              </Form.Item>

              <Form.Item
                name="accountNumber"
                label="Account Number"
                rules={[{
                  required: true,
                  message: 'Please input your bank account number!',
                }]}>
                <Input/>
              </Form.Item>

              <Form.Item
                name="accountName"
                label="Account Name"
                rules={[{
                  required: true,
                  message: 'Please input your bank account Name!',
                }]}>
                <Input/>
              </Form.Item>
            </Space>

          </Form.Item>

          <Form.Item name="customer">

            <Divider orientation="left">Customer</Divider>

            <div className={styles.customer}>

              <div className={styles.customerInfo}>
                <Form.Item
                  className={`${styles.widthHalf} ${styles.marginRight}`}
                  name="firstName"
                  label="First Name"
                  rules={[{
                    required: true,
                    message: 'Please input customer first name!',
                  }]}>
                  <Input/>
                </Form.Item>

                <Form.Item
                  className={styles.widthHalf}
                  name="lastName"
                  label="Last Name"
                  rules={[{
                    required: true,
                    message: 'Please input customer last name!',
                  }]}>
                  <Input/>
                </Form.Item>
              </div>

              <div className={styles.customerContact}>
                <Form.Item name="contact" className={styles.widthFull}>
                  <div className={styles.customerContact}>
                    <Form.Item
                      className={`${styles.widthHalf} ${styles.marginRight}`}
                      name="email"
                      label="Email"
                      rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please input customer email!',
                        }
                      ]}>
                      <Input/>
                    </Form.Item>

                    <Form.Item
                      className={styles.widthHalf}
                      name="mobileNumber"
                      label="Mobile"
                      rules={[
                        {
                          required: true,
                          message: 'Please input customer mobile number!',
                        },
                        () => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.reject();
                            }
                            if (isNaN(value)) {
                              return Promise.reject("Mobile number has to be a number.");
                            }

                            const myPhoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i;
                            if (myPhoneRegex.test(value)) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject("Mobile number is not correct!");
                            }
                          },
                        }),
                      ]}>
                      <Input/>
                    </Form.Item>
                  </div>

                </Form.Item>
              </div>

            </div>

            <Form.Item
              className={styles.widthFull}
              label="Addresses">
              <Form.List
                name="addresses"
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 1) {
                        return Promise.reject(new Error('At least 1 address'));
                      }
                    },
                  },
                ]}
              >
                {(fields, {add, remove}, {errors}) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        className={styles.widthFull}
                        required={false}
                        key={field.key}
                      >
                        <Space className={styles.widthFull}>
                          <Form.Item
                            {...field}
                            style={{width: '90%'}}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Please input customer address.",
                              },
                            ]}
                            noStyle
                          >
                            <Input.TextArea placeholder="Address"/>
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined onClick={() => remove(field.name)}/>
                          ) : null}
                        </Space>

                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        className={styles.widthFull}
                        icon={<PlusOutlined/>}
                      >
                        Add address
                      </Button>
                      <Form.ErrorList errors={errors}/>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>


          </Form.Item>

          <Form.Item name="document">

            <Divider orientation="left">Document</Divider>

            <Space direction="horizontal" className={styles.widthFull}>
              <Form.Item
                name="documentId"
                label="Document Id"
                rules={[{
                  required: true,
                  message: 'Please input document id!',
                }]}>
                <Input/>
              </Form.Item>

              <Form.Item
                name="documentName"
                label="Document Name"
                rules={[{
                  required: true,
                  message: 'Please input document name!',
                }]}>
                <Input/>
              </Form.Item>

              <Form.Item
                name="documentUrl"
                label="Document Url"
                rules={[{
                  required: true,
                  message: 'Please input document url!',
                },
                  {
                    type: "url",
                    message: "This field must be a valid url."
                  }]}>
                <Input/>
              </Form.Item>

            </Space>

          </Form.Item>

          <Form.Item
            name="invoiceReference"
            label="Invoice Reference"
            rules={[{
              required: true,
              message: 'Please input invoice reference!',
            }]}>
            <Input/>
          </Form.Item>

          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{
              required: true,
              message: 'Please input invoice number!',
            }]}>
            <Input/>
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            rules={[{
              required: true,
              message: 'Please input currency!',
            }]}>
            <Input/>
          </Form.Item>

          <Form.Item
            name="invoiceDate"
            label="Date"
            className={styles.widthFull}
            rules={[{
              required: true,
              message: 'Please select date!',
            }]}>
            <DatePicker className={styles.widthFull}/>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            className={styles.widthFull}>
            <Input.TextArea/>
          </Form.Item>

          <Divider orientation="left">Custom fields</Divider>

          <Form.List name="customFields">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => (
                  <Space className={styles.widthFull} key={key} style={{display: 'flex', marginBottom: 8}}
                         align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{required: true, message: 'Missing key'}]}
                    >
                      <Input placeholder="Key"/>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{required: true, message: 'Missing value'}]}
                    >
                      <Input placeholder="Value"/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)}/>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                    Add custom fields
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left">Extensions</Divider>

          <Form.List name="extensions">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => (
                  <Space className={styles.widthFull} key={key} style={{display: 'flex', marginBottom: 8}}
                         align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'addDeduct']}
                      rules={[{required: true, message: 'Missing addDeduct'}]}
                    >
                      <Input placeholder="addDeduct"/>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{required: true, message: 'Missing value'}]}
                    >
                      <Input placeholder="Value"/>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      rules={[{required: true, message: 'Missing type'}]}
                    >
                      <Input placeholder="type"/>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{required: true, message: 'Missing name'}]}
                    >
                      <Input placeholder="name"/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)}/>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                    Add extension
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left">Items</Divider>

          <Form.List name="items">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => (
                  <Space className={styles.widthFull}
                         direction="vertical"
                         key={key} style={{display: 'flex', marginBottom: 8}}
                         align="baseline">
                    <Form.Item
                      {...restField}
                      label='Reference'
                      name={[name, 'itemReference']}
                      rules={[{required: true, message: 'Missing itemReference'}]}
                    >
                      <Input placeholder="item reference"/>
                    </Form.Item>
                    <Form.Item
                      label="description"
                      {...restField}
                      name={[name, 'description']}
                    >
                      <Input.TextArea placeholder="addDeduct"/>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="quantity"
                      name={[name, 'quantity']}
                      rules={[{required: true, message: 'Missing quantity'}]}
                    >
                      <InputNumber placeholder="quantity"/>
                    </Form.Item>
                    <Form.Item
                      label="rate"
                      {...restField}
                      name={[name, 'rate']}
                      rules={[{required: true, message: 'Missing rate'}]}
                    >
                      <InputNumber placeholder="rate"/>
                    </Form.Item>

                    <Form.Item
                      label="name"
                      {...restField}
                      name={[name, 'itemName']}
                      rules={[{required: true, message: 'Missing item name'}]}
                    >
                      <Input placeholder="item name"/>
                    </Form.Item>

                    <Form.Item
                      label="UOM"
                      {...restField}
                      name={[name, 'itemUOM']}
                      rules={[{required: true, message: 'Missing item UOM'}]}
                    >
                      <Input placeholder="itemUOM"/>
                    </Form.Item>

                    <Form.List name="customFields">
                      {(fields, {add, remove}) => (
                        <>
                          {fields.map(({key, name, ...restField}) => (
                            <Space className={styles.widthFull} key={key} style={{display: 'flex', marginBottom: 8}}
                                   align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'key']}
                                rules={[{required: true, message: 'Missing key'}]}
                              >
                                <Input placeholder="Key"/>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'value']}
                                rules={[{required: true, message: 'Missing value'}]}
                              >
                                <Input placeholder="Value"/>
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                              Add custom fields
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.List name="extensions">
                      {(fields, {add, remove}) => (
                        <>
                          {fields.map(({key, name, ...restField}) => (
                            <Space className={styles.widthFull} key={key} style={{display: 'flex', marginBottom: 8}}
                                   align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'addDeduct']}
                                rules={[{required: true, message: 'Missing addDeduct'}]}
                              >
                                <Input placeholder="addDeduct"/>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'value']}
                                rules={[{required: true, message: 'Missing value'}]}
                              >
                                <Input placeholder="Value"/>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'type']}
                                rules={[{required: true, message: 'Missing type'}]}
                              >
                                <Input placeholder="type"/>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[{required: true, message: 'Missing name'}]}
                              >
                                <Input placeholder="name"/>
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                              Add extension
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <MinusCircleOutlined onClick={() => remove(name)}/>

                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                    Add item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>

              <Button onClick={() => router.push('/invoices')}>
                Back
              </Button>
            </Space>

          </Form.Item>

        </Form>
      </div>
    </LayoutDefault>
  )
}

export default withAuth(UpdateInvoices)
