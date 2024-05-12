import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BarotraumaMod {
  id: string,
  name: string,
  path: string,
  status: "enabled" | "disabled"
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  getMods() {
    return this.http.get<BarotraumaMod[]>(`${environment.apiUrl}/mods`)
  }

  saveMods(modData: BarotraumaMod[]) {
    this.http.post(`${environment.apiUrl}/save`, modData.reduce((pv, cv) => { pv[cv.id] = cv.status; return pv }, {} as {[key: string]: string})).subscribe();
  }

  reloadMods() {
    return this.http.post(`${environment.apiUrl}/reload`, null).pipe(concatMap(_ => this.getMods()))
  }
}
