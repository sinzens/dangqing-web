export default {
  invertKeyValues (obj: Record<string, string>) {
    return Object.keys(obj).reduce(
      (inverted: Record<string, string>, key) => {
        inverted[obj[key]] = key
        return inverted
      }, {})
  },

  numberArrayFromRange (start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, index) => {
      return `${index + start}`
    })
  }
}
