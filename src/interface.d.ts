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
  align?: string,
  value: string,
  sortable?: boolean
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

export interface BatchItemDb {
  batchno: string,
  arrialtime: string,
  arrivalnum: string,
  dropoff_no: string,
  stand_no: string,
  security_no: string,
  sc_capacity: string
}

export interface PathItemAtd {
  area: string,
  name: string,
  destination: string,
  path: string
}

export interface PathItemAtdDb {
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

export interface PathItemDtaDb {
  name: string,
  content: string,
  security_no: string,
  areanumber: string,
  path: string
}

export interface BatchBasicModel {
  selectedBatches: string,
  initialSpeed: string,
  preferredSpeed: string,
  recordPositionInterval: string,
  writeCsvInterval: string,
  numberOfPeople: string
}

export interface DataBackup {
  identifier: string,
  data: unknown[]
}

export interface TableDataBackup {
  sourceTable: string,
  backup: DataBackup[]
}
