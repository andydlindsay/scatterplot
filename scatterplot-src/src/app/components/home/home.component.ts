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

  convertSecondsToMinutes(timeInSeconds) {
    const returnString = String(Math.floor(Number(timeInSeconds) / 60)) + ":" + this.zeroPad(String(Number(timeInSeconds) % 60));
    return returnString;
  }

  zeroPad(numToBePadded) {
    if (numToBePadded.length == 1) {
      return "0" + numToBePadded;
    } else {
      return numToBePadded;
    }
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

    // fastest and slowest times and the difference between
    const fastestTime = this.dataset[0]["Seconds"];
    const slowestTime = d3.max(this.dataset, (d) => d["Seconds"]);
    const timeDiff = Number(slowestTime) - Number(fastestTime);
    // console.log("timeDiff:", this.convertSecondsToMinutes(timeDiff));

    const xScale = d3.scaleLinear()
      .domain([timeDiff, 0])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([1, 35])
      .range([height - padding, padding]);

    // x axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(xAxis);

    // add label to x axis
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + ", " + (height - 20) + ")")
      .style("text-anchor", "middle")
      .text("Seconds Behind Fastest Time");

    // y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    // add label to y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Ranking");

    // add plots
    

  }

}
