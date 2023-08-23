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
    const LicenceService = await import("App/Services/LicenceService");
    const FormPeriodService = await import("App/Services/FormPeriodService")
    /**************************************************************************/
    /************************ EXTERNAL SERVICES ********************************/
    /**************************************************************************/

    /**************************************************************************/
    /******************************** REPOSITORIES ****************************/
    /**************************************************************************/
    const WorkerRepository = await import("App/Repositories/WorkerRepository");
    const VacationRepository = await import(
      "App/Repositories/VacationRepository"
    );
    const VacationDaysRepository = await import(
      "App/Repositories/VacationDaysRepository"
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
    const IncapacityRepository = await import(
      "App/Repositories/IncapacityRepository"
    );
    const TypesIncapacityRepository = await import(
      "App/Repositories/IncapacityTypesRepository"
    );
    const LicenceRepository = await import(
      "App/Repositories/LicenceRepository"
    );
    const FormPeriodRepository = await import(
      "App/Repositories/FormsPeriod"
    )
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
      () =>
        new VacationService.default(
          new VacationRepository.default(),
          new VacationDaysRepository.default()
        )
    );

    this.app.container.singleton(
      "core.IncapacityProvider",
      () =>
        new IncapacityService.default(
          new IncapacityRepository.default(),
          new TypesIncapacityRepository.default()
        )
    );

    this.app.container.singleton(
      "core.LicenceProvider",
      () =>
        new LicenceService.default(
          new LicenceRepository.default(),
          new VacationDaysRepository.default(),
          new IncapacityRepository.default()
        )
    );

    this.app.container.singleton(
      "core.FormPeriodProvider",
      () =>
        new FormPeriodService.default(
          new FormPeriodRepository.default(),
        )
    );
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
