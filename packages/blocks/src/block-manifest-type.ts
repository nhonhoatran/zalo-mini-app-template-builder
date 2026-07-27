import { z } from "zod";
import { MvpBlockType } from "@zalo-builder/schema";

export type BlockCategory = "chung" | "ban-hang" | "dich-vu" | "bat-buoc";

export interface BlockManifest<TProps = Record<string, any>> {
  type: MvpBlockType;
  label: string;
  icon: string;
  category: BlockCategory;
  propsSchema: z.ZodTypeAny;
  defaultProps: TProps;
  permissions: string[];
  dependencies: Record<string, string>;
  usesSampleData: (props: TProps) => boolean;
  componentPath: string;
  componentContent: string;
}
