declare module "react" {
  export const useState: any;
  export const useEffect: any;
  export const useMemo: any;
  export const useCallback: any;
  export const useRef: any;
  export default any;
}

declare module "zmp-ui" {
  export const Box: any;
  export const Text: any;
  export const Button: any;
  export const Icon: any;
  export const Input: any;
  export const Swiper: any;
  export default any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
