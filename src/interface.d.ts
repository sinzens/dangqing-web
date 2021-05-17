import SocketHandler from "./plugins/socketHandler";

declare module 'vue/types/vue' {
  interface Vue {
    $socket: SocketHandler
  }
}

export interface InputForm {
  label: string,
  value: string
}

export interface DataHeader {
  text: string,
  align: string,
  value: string
}

export interface BatchItem {
  batchNo: string,
  arrivalTime: string,
  arrivalNum: string,
  dropOffNo: string,
  standNo: string,
  securityNo: string,
  scCapacity: string
}

export interface PathItemAtd {
  area: string,
  name: string,
  destination: string,
  path: string
}

export interface PathItemDta {
  name: string,
  content: string,
  securityNo: string,
  areaNumber: string,
  path: string
}
