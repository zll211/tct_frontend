import Config from '@/config/config';
import { RxStomp } from '@stomp/rx-stomp';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

class StompInit {
  /**
   * stomp 实例
   */
  rxStomp;

  /**
   * 分析进度消息的Observable
   */
  progress$;

  /**
   * 识别图消息的Observable
   */
  picture$;

  /**
   * 是否连接
   */
  connected$;

  /**
   * 连接状态
   */
  connectionState$;

  /**
   * 未被处理的消息
   */
  unhandledMessage$;
  constructor() {
    console.log('StompInit constructor');
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: `${Config.stomp.protocol}://${Config.stomp.host}:${Config.stomp.port}/ws`,
      connectHeaders: {
        login: Config.stomp.login,
        passcode: Config.stomp.passcode
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 1000,
      debug: msg => {
        // console.warn('stomp debug -------- ', msg);
      }
    });
  }
  init() {
    console.log('StompInit init');
    // 开启连接
    this.rxStomp.activate();

    // 订阅 分析进度 消息队列
    this.progress$ = this.rxStomp.watch('/topic/progress').pipe(
      // tap(message => console.log('progress Message', message)),
      distinctUntilChanged((prev, next) => prev.headers['message-id'] === next.headers['message-id']),
      map(message => JSON.parse(message.body)),
      filter(data => data.id),
      map(data => ({
        id: data.id,
        progress: data.value,
        status: data.state
      })),
      tap(body => console.log('progress body', body))
    );

    // 订阅 分析出的图片 消息队列
    this.picture$ = this.rxStomp.watch('/topic/picture').pipe(
      // tap(message => console.log('picture Message', message)),
      distinctUntilChanged((prev, next) => prev.headers['message-id'] === next.headers['message-id']),
      map(message => JSON.parse(message.body)),
      tap(body => console.log('picture body', body))
    );

    // 是否连接
    this.connected$ = this.rxStomp.connected$.pipe(distinctUntilChanged()).subscribe(e => console.log('connected$', e));

    // 连接状态
    this.connectionState$ = this.rxStomp.connectionState$
      .pipe(distinctUntilChanged())
      .subscribe(e => console.log('connectionState$', e));

    // 未处理的消息
    this.unhandledMessage$ = this.rxStomp.unhandledMessage$.pipe(
      distinctUntilChanged((prev, next) => prev.headers['message-id'] === next.headers['message-id']),
      map(message => JSON.parse(message.body))
    );
  }

  dispose() {
    console.log('StompInit dispose');
    this.connected$.unsubscribe();
    this.connectionState$.unsubscribe();
    this.unhandledMessage$.unsubscribe();
    this.rxStomp.deactivate();
  }
}
const stompInit = new StompInit();
export default stompInit;
