import { Component, OnInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private d3: D3;
  dataset: any;

  constructor(
    d3Service: D3Service,
    private titleService: Title,
    private data: DataService
  ) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    // title the page
    this.titleService.setTitle('Scatterplot - FCC');

    this.data.getJson().subscribe(
      data => {
        if (data) {
          this.dataset = data;
          this.drawScatterplot();
        }
      }
    );
    
  }

  drawScatterplot() {
    // alias d3
    let d3 = this.d3;

    // setup svg component
    const width = 1000,
          height = 750,
          padding = 60;

    // append svg component
    const svg = d3.select("#svg")
      .append("svg")
      .attr("class", "svg")
      .attr("width", width)
      .attr("height", height);

    // fastestTime will be used to calculate how far back other times are
    const fastestTime = this.dataset[0]["Seconds"];

    



  }

}
