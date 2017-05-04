import { Component, OnInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';
import { legendColor } from 'd3-svg-legend';

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
    // this.d3.legendColor = legendColor;
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
    const returnString = String(Math.floor(Number(timeInSeconds) / 60)) + ':' + this.zeroPad(String(Number(timeInSeconds) % 60));
    return returnString;
  }

  zeroPad(numToBePadded) {
    if (numToBePadded.length === 1) {
      return '0' + numToBePadded;
    } else {
      return numToBePadded;
    }
  }

  drawScatterplot() {
    // alias d3
    const d3 = this.d3;

    // setup svg component
    const width = 1000,
          height = 650,
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
    const lastPlace = Number(d3.max(this.dataset, (d) => d["Place"]));

    // add/subtract from domain to extend graph beyond data points
    const xScale = d3.scaleLinear()
      .domain([timeDiff + 5, -5])
      .range([padding, width - padding]);

    // add/subtract from domain to extend graph beyond data points
    const yScale = d3.scaleLinear()
      .domain([0, 36])
      .range([height - padding, 0]);

    // x axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(xAxis);

    // axis label based on d3noob's block
    // https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
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
      .attr("x", 60 - (height / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Rider Ranking");

    // tooltip
    const div = d3.select("#svg")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // add plots
    svg.selectAll("circle")
      .data(this.dataset)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(Number(d["Seconds"]) - fastestTime) )
      .attr("cy", (d) => yScale(d["Place"]) )
      .attr("r", 5)
      .attr("fill", (d) => {
        if (d["Doping"].length > 0) {
          return "red";
        } else {
          return "blue";
        }
      })
      .on('mouseover', (d) => {
        div.transition()
          .duration(100)
          .style('opacity', 1);
        div.html('<h2>'
          + d['Name']
          + ' (' + d['Nationality']
          + ')</h2><h3>Time Behind Fastest: '
          + this.convertSecondsToMinutes(d['Seconds'] - fastestTime)
          + '</h3><h3>Year: '
          + d['Year']
          + ', Time: '
          + d['Time']
          + '</h3><h3>'
          + d['Doping']
          + '</h3>');
      })
      .on("mouseout", (d) => {
        div.transition()
          .duration(750)
          .style("opacity", 0);
      });

    // legend
    const ordinal = d3.scaleOrdinal()
      .domain(["Riders with doping allegations", "No doping allegations"])
      .range(["red", "blue"]);

    svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(" + String(width - 350) + ", 280)");

    const colorLegend = legendColor()
      .scale(ordinal);

    svg.select(".legendQuant")
      .call(colorLegend);

  }

}
