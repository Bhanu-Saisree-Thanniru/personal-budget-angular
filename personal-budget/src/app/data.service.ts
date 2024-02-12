import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Datasource } from './dataSource';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  public dataSource: Datasource = {
    datasets: [
        {
            data: [] as any[],
            backgroundColor: [
                'red',
                'blue',
                'teal',
                'black',
                'orange',
                'silver',
                'grey',
                'green'
            ],
        }
    ],
    labels: [] as any[]
  };

  public respData: any = []
  constructor(private httpClient : HttpClient) { }
  private requestUrl = 'http://localhost:3000/budget';

  getDataFromURL(){
    return this.httpClient.get<any[]>(this.requestUrl);
  }
  setData(data: Datasource){
      this.dataSource = data;
  }
  getData() : Datasource{
    return this.dataSource;
  }
  setRespData(data: any[]){
    this.respData = data;
  }

  getRespData(): any[]{
    return this.respData;
  }
}
