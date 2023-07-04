declare module "@ioc:core.WorkerProvider" {
  import { IWorkerService } from "App/Services/WorkerService";

  const WorkerProvider: IWorkerService;
  export default WorkerProvider;
}
