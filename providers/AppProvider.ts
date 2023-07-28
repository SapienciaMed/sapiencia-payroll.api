import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    /**************************************************************************/
    /******************************** SERVICES ********************************/
    /**************************************************************************/
    const VinculationProvider = await import("App/Services/VinculationService");
    const VacationService = await import("App/Services/VacationService");
    const IncapacityService = await import("App/Services/IncapacityService");
<<<<<<< HEAD
=======

>>>>>>> S3-NOM014
    /**************************************************************************/
    /************************ EXTERNAL SERVICES ********************************/
    /**************************************************************************/

    /**************************************************************************/
    /******************************** REPOSITORIES ****************************/
    /**************************************************************************/
    const WorkerRepository = await import("App/Repositories/WorkerRepository");
<<<<<<< HEAD
    const IncapacityRepository = await import(
      "App/Repositories/IncapacityRepository"
    );
    const VacationRepository = await import(
      "App/Repositories/VacationRepository"
    );
    const EmploymentRepository = await import(
      "App/Repositories/EmploymentRepository"
    );

    const RelativeRepository = await import(
      "App/Repositories/RelativeRepository"
    );

    const ChargesRepository = await import(
      "App/Repositories/ChargesRepository"
    );
    const TypesContractsRepository = await import(
      "App/Repositories/TypesContractsRepository"
    );
=======
    const VacationRepository = await import("App/Repositories/VacationRepository");
    const EmploymentRepository = await import("App/Repositories/EmploymentRepository");
    const RelativeRepository = await import("App/Repositories/RelativeRepository");
    const ChargesRepository = await import("App/Repositories/ChargesRepository");
    const TypesContractsRepository = await import("App/Repositories/TypesContractsRepository");
    const IncapacityRepository = await import("App/Repositories/IncapacityRepository");
>>>>>>> S3-NOM014

    /**************************************************************************/
    /******************************** CORE  ***********************************/
    /**************************************************************************/

    this.app.container.singleton(
      "core.VinculationProvider",
      () =>
        new VinculationProvider.default(
          new WorkerRepository.default(),
          new RelativeRepository.default(),
          new EmploymentRepository.default(),
          new TypesContractsRepository.default(),
          new ChargesRepository.default()
        )
    );

    this.app.container.singleton(
      "core.VacationProvider",
      () => new VacationService.default(new VacationRepository.default())
    );

    this.app.container.singleton(
      "core.IncapacityProvider",
      () => new IncapacityService.default(new IncapacityRepository.default())
    );
<<<<<<< HEAD
=======

>>>>>>> S3-NOM014
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
