import API from "@/utils/api"

const getInvoices = async (params: any) => {
  return await API.get({
    url: `/api/invoices`,
    params
  })
}

const invoicesServices = {
  getInvoices,
}

export default invoicesServices
