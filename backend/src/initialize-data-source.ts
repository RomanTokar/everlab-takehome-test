import csvtojson from "csvtojson";
import path from "path";
import { RawDiagnosticMetric } from "./types";
import { AppDataSource } from "./data-source";
import { DiagnosticMetric } from "./entities/diagnostic-metric";

function numberOrNull(value: string): number | null {
  if (value === "") return null;
  return +value;
}

export async function initializeDataSource() {
  console.log("Initializing data source");
  await AppDataSource.initialize();
  const filePath = path.resolve(__dirname, "files/diagnostic_metrics.csv");
  console.log(filePath);
  const rawDiagnosticMetrics: RawDiagnosticMetric[] = await csvtojson().fromFile(filePath);
  const diagnosticMetricRepository = AppDataSource.getRepository(DiagnosticMetric);
  await diagnosticMetricRepository.clear();
  const diagnosticMetrics = rawDiagnosticMetrics.map((metric) => {
    const diagnosticMetric = new DiagnosticMetric();
    diagnosticMetric.name = metric.name;
    diagnosticMetric.oru_sonic_codes = metric.oru_sonic_codes;
    diagnosticMetric.diagnostic = metric.diagnostic;
    diagnosticMetric.diagnostic_groups = metric.diagnostic_groups;
    diagnosticMetric.oru_sonic_units = metric.oru_sonic_units;
    diagnosticMetric.units = metric.units;
    diagnosticMetric.min_age = numberOrNull(metric.min_age);
    diagnosticMetric.max_age = numberOrNull(metric.max_age);
    diagnosticMetric.gender = metric.gender;
    diagnosticMetric.standard_lower = numberOrNull(metric.standard_lower);
    diagnosticMetric.standard_higher = numberOrNull(metric.standard_higher);
    diagnosticMetric.everlab_lower = numberOrNull(metric.everlab_lower);
    diagnosticMetric.everlab_higher = numberOrNull(metric.everlab_higher);
    return diagnosticMetric;
  });
  await diagnosticMetricRepository.save(diagnosticMetrics);
  console.log("Data source initialized");
}
