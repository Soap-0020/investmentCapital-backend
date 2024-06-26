import Execute from "./execute";

type Component = {
  data: string;
  execute: Execute;
  disabled: boolean | (() => boolean);
  requiedPrestige: number | null;
};

export default Component;
