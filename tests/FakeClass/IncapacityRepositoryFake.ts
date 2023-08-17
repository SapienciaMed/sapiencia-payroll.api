import { IIncapacity, IFilterIncapacity, IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import IncapacityRepository from "App/Repositories/IncapacityRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";


const getIncapacityFake: IGetIncapacity = 
    {
        userCreate: "test",
        id: 9,
        codIncapacityType: 2,
        codEmployment: 2,
        dateInitial: DateTime.fromISO("02/16/2023"),
        dateFinish: DateTime.fromISO("02/16/2023"),
        comments: "smoke test QA 14 08 2023",
        isExtension: false,
        userModified: "test",
        dateModified: DateTime.fromISO("02/16/2023"),
        dateCreate: DateTime.fromISO("02/16/2023"),
        typeIncapacity: {
            id: 2,
            name: "Enfermedad laboral"
        },
        employment: {
            id: 2,
            workerId: 4,
            idCharge:1, 
            institutionalMail:"test@test.com", 
            contractNumber:"1233454", 
            startDate:DateTime.fromISO("02/16/2023"),
            state: "test",
            idTypeContract:1,
            worker: {
                id: 4,
                typeDocument: "CC",
                numberDocument: "1030523782",
                firstName: "Jeisson",
                secondName: "Andrés",
                surname: "González",
                secondSurname: "Martínez",
                gender: "",
                bloodType: "",
                birthDate: DateTime.fromISO("02/16/2023"),
                nationality: "",
                contactNumber: "",
                department: "",
                municipality: "",
                neighborhood: "",
                address: ""
            }
        }
    };
export class IncapacityRepositoryFake implements IncapacityRepository {
  createIncapacity(_incapacity: IIncapacity): Promise<IIncapacity> {
    return Promise.resolve(_incapacity);
  }
  getIncapacityPaginate(_filters: IFilterIncapacity): Promise<IPagingData<IGetIncapacity>> {
      throw new Error("Method not implemented.");
  }
  getIncapacityById(_id: number): Promise<IGetIncapacity | null> {
      throw new Error("Method not implemented.");
  }
  updateIncapacity(_incapacity: IIncapacity, _id: number): Promise<IIncapacity | null> {
      throw new Error("Method not implemented.");
  }
  
  
  getIncapacityDateCodEmployment(_codEmployment:number,_dateStart:DateTime,_dateEnd:DateTime): Promise<IGetIncapacity[]> {
    const list = [getIncapacityFake];

    return new Promise((res) => {
      const incapacity = list.find(
        (licence) => licence.codEmployment === _codEmployment
      );

      if (!incapacity) {
        return res([]);
      }

      return res([incapacity]);
    });
  }
  
}
