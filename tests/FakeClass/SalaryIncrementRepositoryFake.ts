import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ISalaryIncrement, ISalaryEditIncrement } from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryIncrementRepository from "App/Repositories/SalaryIncrementRepository";
import { DateTime } from "luxon";

const salaryIncrementFake: ISalaryIncrement = {
    codCharge: 6,
    effectiveDate: DateTime.fromISO("02/08/2023"),
    numberActApproval: "123 de 25 agosto",
    porcentualIncrement: false,
    incrementValue: 2000,
    previousSalary: 0,
    newSalary: 890000,
    observation: "test",
    userModified: "12345678",
    userCreate: "12345678",
    dateModified: DateTime.fromISO("02/08/2023"),
    dateCreate: DateTime.fromISO("02/08/2023"),
}

export class SalaryIncrementRepositoryFake implements SalaryIncrementRepository {
    createSalaryIncrement(_salaryIncrement: ISalaryIncrement, _trx: TransactionClientContract): Promise<ISalaryIncrement> {
       return Promise.resolve(salaryIncrementFake);
    }
    updateSalaryIncrement(_salaryIncrement: ISalaryEditIncrement, _trx: TransactionClientContract): Promise<ISalaryEditIncrement | null> {
        throw new Error("Method not implemented.");
    }
    getSalaryIncrementById(_id: number): Promise<ISalaryEditIncrement | null> {
        throw new Error("Method not implemented.");
    }

}
