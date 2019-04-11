import { baseUrl } from '@/config/config';
import { BehaviorSubject, defer, from, Observable } from 'rxjs';
import { filter, map, switchMapTo, tap, pluck } from 'rxjs/operators';
import Vue from 'vue';

// 待分析的状态
export class AnalysisStatus {
  static processing = '分析中';
  static analyzed = '已分析';
  static notAnalyzed = '待分析';
  static pending = '等待分析';
}

// 分析中的状态
export class ProcessingAnalysisStatus {
  static init = 'init';
  static started = 'started';
  static done = 'ananysis_state';
  static failed = 'failed';
  static processing = 'analysis_progress';
}

class AnalysisService {
  /**
   * 分析中和等待分析的列表
   */
  pendingCount$;

  /**
   * 更新列表
   */
  updatePendingCount$;

  /**
   * 正在分析的病理
   */
  current$;
  init() {
    console.log('AnalysisService init');
    this.pendingCount$ = new BehaviorSubject([]);
    this.current$ = new BehaviorSubject({});
    new Observable(observer => (this.updatePendingCount$ = observer))
      .pipe(
        switchMapTo(
          defer(_ =>
            from(
              Vue.http.get(`${baseUrl}/sections`, {
                params: {
                  ananysis_status: AnalysisStatus.pending
                }
              })
            )
          )
        ),
        pluck('body', 'meta', 'pagination', 'total'),
        filter(count => count !== undefined),
        tap(count => console.log('get pendingCount', count))
      )
      .subscribe(count => this.pendingCount$.next(count));
  }
  dispose() {
    console.log('AnalysisService dispose');
    this.updatePendingCount$.complete();
  }
}
const analysisService = new AnalysisService();
export default analysisService;
