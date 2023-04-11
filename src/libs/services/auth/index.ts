import API from "@/utils/api"

const logout = async () => {

}

const login = async (payload: { username: string; password: string; }) => {
  return await API.post({
    url: `/api/auth/login`,
    payload,
  })
}

const getMembership = async () => {
  return await API.get({
    url: `/api/auth/membership`,
  })
}

const authServices = {
  login,
  getMembership,
  logout,
}

export default authServices
