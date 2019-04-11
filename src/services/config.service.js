import { baseUrl } from '@/config/config';
import { defer, from, Observable } from 'rxjs';
import { pluck, switchMapTo, tap, filter } from 'rxjs/operators';
import Vue from 'vue';

class ConfigService {
  /**
   * 分析项设置
   */
  analysisConfig$;

  /**
   * 更新分析项设置
   */
  updateAnalysisConfig$;

  /**
   * rabbitmq设置
   */
  rabbitmqConfig$;

  /**
   * 更新rabbitmq设置
   */
  updateRabbitmqConfig$;
  init() {
    console.log('ConfigService init');
    this.analysisConfig$ = new Observable(observer => (this.updateAnalysisConfig$ = observer)).pipe(
      switchMapTo(defer(_ => from(Vue.http.get(`${baseUrl}/settings?type=analysis`)))),
      pluck('body'),
      filter(data => data !== undefined),
      tap(data => console.log('get analysisConfig', data))
    );
    this.rabbitmqConfig$ = new Observable(observer => (this.updateRabbitmqConfig$ = observer)).pipe(
      switchMapTo(defer(_ => from(Vue.http.get(`${baseUrl}/settings?type=rabbitmq`)))),
      pluck('body'),
      filter(data => data !== undefined),
      tap(data => console.log('get rabbitmqConfig', data))
    );
  }
  dispose() {
    console.log('ConfigService dispose');
    this.updateAnalysisConfig$.complete();
    this.updateRabbitmqConfig$.complete();
  }
}
const configService = new ConfigService();
export default configService;
