import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColumnNumericTransformer } from "../transformers/column-numeric-transformer";

export enum DiagnosticMetricGender {
  Any = "Any",
  Male = "Male",
  Female = "Female",
}

@Entity()
export class DiagnosticMetric {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  oru_sonic_codes: string;

  @Column()
  diagnostic: string;

  @Column()
  diagnostic_groups: string;

  @Column()
  oru_sonic_units: string;

  @Column()
  units: string;

  @Column({ type: "numeric", nullable: true, transformer: new ColumnNumericTransformer() })
  min_age: number | null;

  @Column({ type: "numeric", nullable: true, transformer: new ColumnNumericTransformer() })
  max_age: number | null;

  @Column({ type: "enum", enum: DiagnosticMetricGender })
  gender: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  standard_lower: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  standard_higher: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  everlab_lower: number | null;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  everlab_higher: number | null;
}
