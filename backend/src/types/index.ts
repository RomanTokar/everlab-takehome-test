export type RawDiagnosticMetric = Record<
  | "name"
  | "oru_sonic_codes"
  | "diagnostic"
  | "diagnostic_groups"
  | "oru_sonic_units"
  | "units"
  | "min_age"
  | "max_age"
  | "gender"
  | "standard_lower"
  | "standard_higher"
  | "everlab_lower"
  | "everlab_higher",
  string
>;
