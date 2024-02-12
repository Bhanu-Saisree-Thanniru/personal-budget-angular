import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';
import { Datasource } from '../dataSource';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  host: {ngSkipHydration : 'true'}
})
export class HomepageComponent implements AfterViewInit{

    public dataSource : Datasource= {
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

    @ViewChild('myChart')
  eleRef!: ElementRef;

    constructor(private http: HttpClient, private chartRef: ElementRef, private dataService: DataService){

    }

    public respData : any = [];

    ngAfterViewInit(): void {

      if(this.dataService.getData().datasets[0].data.length == 0   || this.dataService.getRespData().length == 0){
        this.dataService.getDataFromURL().subscribe((res: any) => {
          for(var i = 0; i < res.myBudget.length; i++){
            this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
            this.dataSource.labels[i] = res.myBudget[i].title;

            this.respData.push({
              "label": res.myBudget[i].title,
              "value": res.myBudget[i].budget,
            });
          }
          this.dataService.setData(this.dataSource);
          this.dataService.setRespData(this.respData);

          this.createChart();
          this.createSvg();
          this.createColors();
          this.drawChart();
        })
      }
      else{
          this.createChart();
          this.createSvg();
          this.createColors();
          this.drawChart();
      }
    }

    createChart(){
      var ct = this.chartRef.nativeElement.querySelector('#myChart').getContext('2d');
      var myPieChart = new Chart(ct, {
          type: "pie",
          data: this.dataSource
      });
    }
    private svg: any;
    private margin = 950;
    private width = 750;
    private height = 600;
    private radius = Math.min(this.width, this.height) / 2;
    private colors: any;
    private createSvg(): void {
      this.svg = d3.select("#d3JSChart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }


  private createColors(): void {
    this.colors = d3.scaleOrdinal()
    .domain(this.dataService.getRespData().map((d: any) => d.value))
    .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

    private drawChart(): void {
      // Compute the position of each group on the pie:
      const pie = d3.pie<any>().value((d: any) => Number(d.value));
      // Build the pie chart
      this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getRespData()))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: any) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

      // Add labels
      const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

      this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getRespData()))
      .enter()
      .append('text')
      .text((d: any)=> d.data.label)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
    }
  }
