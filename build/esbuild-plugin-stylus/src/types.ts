export interface Options {
  sourcemap?: boolean;
  use?: ((arg: any) => any)[];
  import?: string[];
  include?: string[];
  define?: [string, any];
}
