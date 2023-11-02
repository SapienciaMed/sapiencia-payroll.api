import { IParameter } from "App/Interfaces/CoreInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import axios, { AxiosInstance } from "axios";

export default class CoreService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.URL_API_CORE,
    });
  }

  public async getParametersByCodes(
    codes: Array<string>
  ): Promise<IParameter[]> {
    const dataUser = await this.axiosInstance.get<ApiResponse<IParameter[]>>(
      `/api/v1/parameter/get-by-codes`,
      {
        params: {
          codes,
        },
        headers: {
          Authorization: process.env.CURRENT_AUTHORIZATION,
        },
      }
    );
    return dataUser.data.data;
  }
}
