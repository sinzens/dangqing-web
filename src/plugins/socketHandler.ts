export default class SocketHandler {
  private socket: WebSocket
  private messageCallback: (result: unknown) => void

  constructor () {
    this.socket = this.initWebSocket()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.messageCallback = (result: unknown): void => {}
  }

  private initWebSocket () {
    const uri = 'ws://localhost:11037/'
    const socket = new WebSocket(uri)
    socket.onopen = this.onSocketOpen.bind(this)
    socket.onmessage = this.onSocketMessage.bind(this)
    socket.onerror = this.onSocketError.bind(this)
    socket.onclose = this.onSocketClose.bind(this)
    return socket
  }

  private onGetVersion (data: string) {
    console.log(`Database version is: ${data}`)
  }

  private onGetJsonData (data: string) {
    const paths = JSON.parse(data)
    this.messageCallback(paths)
  }

  private onGetInfo (info: string) {
    this.messageCallback(`info|${info}`)
  }

  private onGetError (error: string) {
    this.messageCallback(`error|${error}`)
  }

  protected onSocketOpen () {
    this.socketSend('Client connected.')
    this.socketSend('cmd|getVersion')
  }

  protected onSocketMessage (event: MessageEvent<unknown>) {
    const data = event.data as string
    if (data.startsWith('res')) {
      const results = data.split('|')
      const command = results[1]
      const value = results[2]

      switch (command) {
        case 'version':
          this.onGetVersion(value)
          break
        case 'batches':
        case 'pathsAtd':
        case 'pathsDta':
          this.onGetJsonData(value)
          break
        case 'info':
          this.onGetInfo(value)
          break
        case 'error':
          this.onGetError(value)
          break
      }
    }
  }

  protected onSocketError (_event: Event) {
    console.log('Failed to connect.')
  }

  protected onSocketClose (_event: CloseEvent) {
    console.log('Connection closed.')
  }

  public socketSend (
    data: string,
    callback?: (result: unknown) => void
  ) {
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(data)
      if (callback) {
        this.messageCallback = callback
      }
    }
  }
}
