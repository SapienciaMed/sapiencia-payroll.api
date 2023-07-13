import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    /**************************************************************************/
    /******************************** SERVICES ********************************/
    /**************************************************************************/
    const VinculationProvider = await import("App/Services/VinculationService");

    /**************************************************************************/
    /************************ EXTERNAL SERVICES ********************************/
    /**************************************************************************/

    /**************************************************************************/
    /******************************** REPOSITORIES ****************************/
    /**************************************************************************/
    const WorkerRepository = await import("App/Repositories/WorkerRepository");
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
