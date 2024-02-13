import axiosInstance from "./axiosInstance.ts";

export type Result = {
  observationMetric: string;
  observationValue: number;
  standardHigher: number;
  standardLower: number;
};

export async function getResults(file: File): Promise<Result[]> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post("/get-results", formData);
  return response.data;
}
