import standMap from '../assets/standMap.json'
import securityMap from '../assets/securityMap.json'
import Public from '../plugins/public'
import { BatchItem, PathItemAtd, PathItemDta } from '../interface'

export default {
  standMap: standMap,
  securityMap: securityMap,
  standMapInverted: Public.invertKeyValues(standMap),
  securityMapInverted: Public.invertKeyValues(securityMap),

  batchPlainDataToText (batch_: BatchItem) {
    const batch = {} as BatchItem
    Object.assign(batch, batch_)
    batch.dropOffNo = standMap[batch.dropOffNo]
    batch.securityNo = securityMap[batch.securityNo]
    return batch
  },

  batchTextToPlainData (batch_: BatchItem) {
    const batch = {} as BatchItem
    Object.assign(batch, batch_)
    batch.dropOffNo = this.standMapInverted[batch.dropOffNo]
    batch.securityNo = this.securityMapInverted[batch.securityNo]
    return batch
  },

  pathPlainDataToTextAtd (path_: PathItemAtd) {
    const path = {} as PathItemAtd
    Object.assign(path, path_)
    path.area = standMap[path.area]
    path.destination = securityMap[path.destination]
    return path
  },

  pathTextToPlainDataAtd (path_: PathItemAtd) {
    const path = {} as PathItemAtd
    Object.assign(path, path_)
    path.area = this.standMapInverted[path.area]
    path.destination = this.securityMapInverted[path.destination]
    return path
  },

  pathPlainDataToTextDta (path_: PathItemDta) {
    const path = {} as PathItemDta
    Object.assign(path, path_)
    path.securityNo = securityMap[path.securityNo]
    return path
  },

  pathTextToPlainDataDta (path_: PathItemDta) {
    const path = {} as PathItemDta
    Object.assign(path, path_)
    path.securityNo = this.securityMapInverted[path.securityNo]
    return path
  }
}
