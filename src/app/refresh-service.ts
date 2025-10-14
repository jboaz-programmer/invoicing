import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  // dynamic subjects keyed by string
  private subjects: { [key: string]: BehaviorSubject<any[]> } = {};

  // get observable for a key
  getObservable(key: string): Observable<any[]> {
    if (!this.subjects[key]) {
      this.subjects[key] = new BehaviorSubject<any[]>([]);
    }
    return this.subjects[key].asObservable();
  }

  // update value for a key
  update(key: string, data: any[]): void {
    if (!this.subjects[key]) {
      this.subjects[key] = new BehaviorSubject<any[]>(data);
    } else {
      this.subjects[key].next(data);
    }
  }

 
  pushItem(key: string, item: any): void {
  if (!this.subjects[key]) {
    this.subjects[key] = new BehaviorSubject<any[]>([item]);
  } else {
    const current = this.subjects[key].value;
    // add new item at the start of the array
    this.subjects[key].next([item, ...current]);
  }
}

}
