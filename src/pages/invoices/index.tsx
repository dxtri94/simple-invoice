import Head from 'next/head'
import LayoutDefault from '@/components/layout/default'
import {ERROR_UNAUTHORIZED} from '@/constants/common'
import {useRouter} from 'next/router'
import styles from './Invoices.module.scss'
import React, {useEffect, useState} from "react";
import {getInvoicesAPI} from "@/pages/api/invoices";
import {withAuth} from "@/hoc/withAuth";
import {GetServerSideProps} from "next";
import {Breadcrumb, Button, DatePicker, Input, Modal, notification, Select, Space, Table, Tag} from "antd";
import {IPagination, IPaginationAPI} from "@/types/pagination";
import {IInvoice} from "@/types/invoices";
import invoicesServices from "@/services/invoices";
import dayjs, {Dayjs} from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";

const {Search} = Input;

interface InvoicesProps {
  invoices?: IInvoice[];
  paging?: IPaginationAPI;
  error?: any;
  user?: any;
}

const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  {label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()]},
  {label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()]},
  {label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()]},
  {label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()]},
];

const Invoices: React.FC = ({invoices, paging, error, user}: InvoicesProps) => {
  const router = useRouter();
  const {RangePicker} = DatePicker;

  const {confirm} = Modal;

  const [currentPaging, setCurrentPaging] = useState<IPagination>({
    page: paging?.pageNumber || 1,
    pageSize: paging?.pageSize || 10,
    total: paging?.totalRecords || 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentInvoices, setCurrentInvoices] = useState<IInvoice[] | undefined>(invoices);
  const [rangeDate, setRangeDate] = useState<{
    fromDate: any,
    toDate: any,
  }>({
    fromDate: dayjs().add(-30, 'd'),
    toDate: dayjs(),
  })
  const [status, setStatus] = useState<any>('');
  const [currentSearch, setCurrentSearch] = useState<string>('');

  useEffect(() => {
    if (error?.error && error?.error === ERROR_UNAUTHORIZED) {
      router.push('/login');
      notification.error({
        message: ERROR_UNAUTHORIZED,
        description: 'Your token has been expired. Please login again to continue using our app. Thank you!'
      })
    }
  }, [error, router])

  const onChangeDate = async (date: any) => {
    try {
      if (date?.length > 1) {
        await setIsLoading(true);
        const {data, error} = await invoicesServices.getInvoices({
          fromDate: date?.[0]?.format('YYYY-MM-DD'),
          toDate: date?.[1]?.format('YYYY-MM-DD'),
          pageSize: currentPaging.page,
          pageNum: currentPaging.pageSize,
          status,
          keyword: currentSearch,
        })

        if (data?.data) {
          await setCurrentInvoices(data?.data)
          await setRangeDate({
            fromDate: date?.[0],
            toDate: date?.[1]
          })
          await setIsLoading(false);
        } else {
          notification.error({
            message: 'Get invoices failed!',
            description: error?.error || 'Something wrong'
          })
          await setIsLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  const handleChange = async (pagination: any, filters: any, sorter: any) => {
    try {
      setIsLoading(true);

      let params: {
        pageSize: number;
        pageNum: number;
        ordering: string;
        sortBy: string;
        fromDate: string | undefined;
        toDate: string | undefined;
        keyword: string;
      } = {
        pageSize: pagination?.pageSize || 10,
        pageNum: pagination?.current || 1,
        ordering: '',
        sortBy: '',
        fromDate: undefined,
        toDate: undefined,
        keyword: currentSearch,
      };
      if (sorter?.columnKey && sorter?.order) {
        params.ordering = sorter?.order === 'ascend' ? 'ASCENDING' : sorter?.order === 'descend' ? 'DESCENDING' : '';
        params.sortBy = sorter?.columnKey;
      }

      if (rangeDate?.fromDate) {
        params.fromDate = rangeDate?.fromDate?.format('YYYY-MM-DD')
      }

      if (rangeDate?.toDate) {
        params.toDate = rangeDate?.toDate?.format('YYYY-MM-DD')
      }

      const {data, error} = await invoicesServices.getInvoices(params)

      if (data?.data) {
        await setCurrentInvoices(data?.data)
        await setCurrentPaging({
          page: data?.paging?.pageNumber || 1,
          pageSize: data?.paging?.pageSize || 10,
          total: data?.paging?.totalRecords || 0
        })
        await setIsLoading(false);

      } else {
        notification.error({
          message: 'Get invoices failed!',
          description: error?.error || 'Something wrong'
        })
        await setIsLoading(false);
      }
    } catch (e) {
      notification.error({
        message: 'Get invoices failed!',
        description: error?.error || 'Something wrong'
      })
      await setIsLoading(false);
    }
  }

  const onChangeStatus = async (value: string) => {
    try {
      setIsLoading(true);

      const {data, error} = await invoicesServices.getInvoices({
        pageSize: currentPaging?.pageSize,
        pageNum: currentPaging?.page,
        fromDate: rangeDate?.fromDate?.format('YYYY-MM-DD'),
        toDate: rangeDate?.toDate?.format('YYYY-MM-DD'),
        status: value,
        keyword: currentSearch,
      })

      if (data?.data) {
        await setCurrentInvoices(data?.data)
        await setCurrentPaging({
          page: data?.paging?.pageNumber || 1,
          pageSize: data?.paging?.pageSize || 10,
          total: data?.paging?.totalRecords || 0
        })
        await setStatus(value);
        await setIsLoading(false);

      } else {
        notification.error({
          message: 'Get invoices failed!',
          description: error?.error || 'Something wrong'
        })
        await setStatus(value);
        await setIsLoading(false);
      }
    } catch (e) {
      notification.error({
        message: 'Get invoices failed!',
        description: error?.error || 'Something wrong'
      })
      await setStatus(value);
      await setIsLoading(false);
    }
  }

  const onSearch = async (value: string) => {
    try {
      setIsLoading(true);

      const {data, error} = await invoicesServices.getInvoices({
        pageSize: currentPaging?.pageSize,
        pageNum: currentPaging?.page,
        fromDate: rangeDate?.fromDate?.format('YYYY-MM-DD'),
        toDate: rangeDate?.toDate?.format('YYYY-MM-DD'),
        status,
        keyword: value
      })

      if (data?.data) {
        await setCurrentInvoices(data?.data)
        await setCurrentPaging({
          page: data?.paging?.pageNumber || 1,
          pageSize: data?.paging?.pageSize || 10,
          total: data?.paging?.totalRecords || 0
        })
        await setCurrentSearch(value);
        await setIsLoading(false);

      } else {
        notification.error({
          message: 'Get invoices failed!',
          description: error?.error || 'Something wrong'
        })
        await setCurrentSearch(value);
        await setIsLoading(false);
      }

    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Get invoices failed!',
        description: error?.error || 'Something wrong'
      })
      await setCurrentSearch(value);
      await setIsLoading(false);
    }
  }

  const onReload = async () => {
    try {
      setIsLoading(true);

      const {data, error} = await invoicesServices.getInvoices({
        pageSize: currentPaging?.pageSize,
        pageNum: currentPaging?.page,
        fromDate: rangeDate?.fromDate?.format('YYYY-MM-DD'),
        toDate: rangeDate?.toDate?.format('YYYY-MM-DD'),
        status,
        keyword: currentSearch
      })

      if (data?.data) {
        await setCurrentInvoices(data?.data)
        await setCurrentPaging({
          page: data?.paging?.pageNumber || 1,
          pageSize: data?.paging?.pageSize || 10,
          total: data?.paging?.totalRecords || 0
        })
        await setIsLoading(false);

      } else {
        notification.error({
          message: 'Get invoices failed!',
          description: error?.error || 'Something wrong'
        })
        await setIsLoading(false);
      }

    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Get invoices failed!',
        description: error?.error || 'Something wrong'
      })
      await setIsLoading(false);
    }
  }

  const onDelete = async (record: IInvoice) => {
    confirm({
      title: 'Delete Invoice',
      icon: <ExclamationCircleOutlined/>,
      centered: true,
      content: `Do you want to delete invoice ${record?.invoiceId}`,
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      render: (text: string) => `${text}`,
      sorter: true
    },
    {
      title: 'Num.',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      sorter: true
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (text: string) => `${text}`
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      sorter: true,
      render: ({status = []}) => (
        <Space>
          {status.map(({key, value}: { key: string, value: boolean }) => (
            value && (<Tag key={key}>{key}</Tag>)
          ))}
        </Space>
      ),
    },
    {
      title: 'Amount',
      key: 'totalAmount',
      sorter: true,
      render: ({totalAmount, currency}: IInvoice) => `${totalAmount.toFixed(2)} ${currency}`,
    },
    {
      title: 'Discount',
      key: 'totalDiscount',
      sorter: true,
      render: ({totalDiscount, currency}: IInvoice) => `${totalDiscount.toFixed(2)} ${currency}`,
    },
    {
      title: 'Paid',
      key: 'totalPaid',
      sorter: true,
      render: ({totalPaid, currency}: IInvoice) => `${totalPaid.toFixed(2)} ${currency}`,
    },
    {
      title: 'Tax',
      key: 'totalTax',
      sorter: true,
      render: ({totalTax, currency}: IInvoice) => `${totalTax.toFixed(2)} ${currency}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: IInvoice) => {
        return (
          <Space size="middle">
            <Button type='default'
                    onClick={() => router.push(`/update/${record?.invoiceId}`)}>
              <EditOutlined/>Edit
            </Button>
            <Button danger onClick={() => onDelete(record)}><DeleteOutlined/> Delete</Button>
          </Space>
        )
      },
    },
  ];

  return (
    <LayoutDefault>
      <Head>
        <title>Invoices</title>
      </Head>
      <div className={styles.top}>
        <Breadcrumb
          items={[
            {
              href: '/invoices',
              title: <HomeOutlined/>,
            },
          ]}
        />
        <Button type="primary" onClick={() => router.push("/invoices/create")}>
          <PlusCircleOutlined/>
          Create</Button>
      </div>
      <div className={styles.container}>
        <div className={styles.filterBoxContainer}>
          <Space align='center' className={styles.filterBox}>

            <Search placeholder="input search text" onSearch={onSearch} style={{width: 300}}/>

            <RangePicker
              defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
              presets={rangePresets}
              onChange={onChangeDate}/>

            <Select
              style={{width: 200}}
              onChange={onChangeStatus}
              value={status}
              options={[
                {value: 'Paid', label: 'Paid'},
                {value: 'Overdue', label: 'Overdue'},
              ]}
            />
          </Space>

          <Button loading={isLoading} type="default"
                  onClick={onReload}>Reload</Button>
        </div>
        <Table columns={columns}
               loading={isLoading}
               rowKey={(record: any) => record?.invoiceId}
               scroll={{x: "max-content"}}
               dataSource={currentInvoices || []}
               pagination={{
                 defaultCurrent: currentPaging.page,
                 total: currentPaging?.total,
                 pageSize: currentPaging.pageSize,
               }}
               className={styles.table}
               onChange={handleChange}
        />
      </div>
    </LayoutDefault>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const {req} = context;
    const {data, error} = await getInvoicesAPI(req);
    return {
      props: {
        invoices: data?.data as IInvoice[],
        paging: data?.paging as IPaginationAPI,
        error,
      }
    }
  } catch (e) {
    console.log("Server error: ", e);
    return {
      props: {
        invoices: [],
        paging: {
          pageNumber: 1,
          pageSize: 10,
          totalRecords: 0
        },
        error: e,
      }
    }
  }
}

export default withAuth(Invoices)
