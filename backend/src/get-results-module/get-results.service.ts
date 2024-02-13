import hl7parser, { Node } from "hl7parser";
import { differenceInYears, parseISO } from "date-fns";
import { AppDataSource } from "../data-source";
import { DiagnosticMetric } from "../entities/diagnostic-metric";

async function findDiagnosticMetric({
  observationMetric,
  gender,
  age,
}: {
  observationMetric: string;
  age: number;
  gender: string;
}) {
  const diagnosticMetricRepository = AppDataSource.getRepository(DiagnosticMetric);
  const genderMap = {
    Male: "M",
    Female: "F",
  };
  const diagnosticMetric = await diagnosticMetricRepository
    .createQueryBuilder("diagnostic_metric")
    .where("diagnostic_metric.oru_sonic_codes like :name", { name: `%${observationMetric}%` })
    .andWhere("diagnostic_metric.gender = :gender", {
      gender: genderMap[gender as keyof typeof genderMap] || "Any",
    })
    .andWhere("diagnostic_metric.min_age <= :age", { age })
    .andWhere("diagnostic_metric.max_age >= :age", { age })
    .getOne();
  return diagnosticMetric;
}

export const getResults = async (file: Express.Multer.File) => {
  const string = file.buffer.toString();
  const message = hl7parser.create(string.trim());
  const gender = message.get("PID.8").toString();
  const stringDateOfBirth = message.get("PID.7").toString();
  const dateOfBirth = parseISO(stringDateOfBirth);
  const age = differenceInYears(new Date(), dateOfBirth);
  const numericObxMessages: Node[] = [];
  message.get("OBX").forEach((obx) => {
    if (obx.get("OBX.2").toString() === "NM") {
      numericObxMessages.push(obx);
    }
  });
  const results = await Promise.all(
    numericObxMessages.map(async (numericObxMessage) => {
      const observationMetric = numericObxMessage.get("OBX.3.2").toString();
      const observationValue = +numericObxMessage.get("OBX.5").toString();
      const diagnosticMetric = await findDiagnosticMetric({
        observationMetric,
        age,
        gender,
      });
      if (!diagnosticMetric) return { metric: observationMetric, observationValue };
      const { standard_lower, standard_higher } = diagnosticMetric;
      if (!standard_lower || !standard_higher)
        return { metric: observationMetric, observationValue };
      return {
        observationMetric,
        observationValue,
        standardLower: standard_lower,
        standardHigher: standard_higher,
      };
    }),
  );
  return results;
};
