let data = view_data_json;
console.log(data); //This is a string that looks like JSON

data = JSON.parse(view_data_json);
console.log(data); // Now this is real JSON!! We are ready to use data.

const url = "/api/consumptionproduction"
 
  // data = [{"state": "NSW", "financial_year": "2008-09", "energy_production_gwh": 72706, "energy_consumption_pj": 1594}, {"state": "NT", "financial_year": "2008-09", "energy_production_gwh": 2922, "energy_consumption_pj": 95}, {"state": "QLD", "financial_year": "2008-09", "energy_production_gwh": 64030, "energy_consumption_pj": 
  // 1346}, {"state": "SA", "financial_year": "2008-09", "energy_production_gwh": 14793, "energy_consumption_pj": 357}, {"state": "TAS", "financial_year": "2008-09", "energy_production_gwh": 8597, "energy_consumption_pj": 114}, {"state": "VIC", "financial_year": "2008-09", "energy_production_gwh": 56751, "energy_consumption_pj": 1428}, {"state": "WA", "financial_year": "2008-09", "energy_production_gwh": 27725, "energy_consumption_pj": 917}, {"state": "NSW", "financial_year": "2009-10", "energy_production_gwh": 73501, "energy_consumption_pj": 1645}, {"state": "NT", "financial_year": "2009-10", "energy_production_gwh": 3267, "energy_consumption_pj": 94}, {"state": "QLD", "financial_year": "2009-10", "energy_production_gwh": 65404, "energy_consumption_pj": 1294}, {"state": "SA", "financial_year": "2009-10", "energy_production_gwh": 14132, "energy_consumption_pj": 344}, {"state": "TAS", "financial_year": "2009-10", "energy_production_gwh": 10015, "energy_consumption_pj": 114}, {"state": "VIC", "financial_year": "2009-10", "energy_production_gwh": 57107, "energy_consumption_pj": 1434}, {"state": "WA", "financial_year": "2009-10", "energy_production_gwh": 28852, "energy_consumption_pj": 906}, {"state": "NSW", "financial_year": "2010-11", "energy_production_gwh": 69947, 
  // "energy_consumption_pj": 1668}, {"state": "NT", "financial_year": "2010-11", "energy_production_gwh": 3091, "energy_consumption_pj": 100}, {"state": "QLD", "financial_year": "2010-11", "energy_production_gwh": 64187, "energy_consumption_pj": 1250}, {"state": "SA", "financial_year": "2010-11", "energy_production_gwh": 14436, "energy_consumption_pj": 343}, {"state": "TAS", "financial_year": "2010-11", "energy_production_gwh": 11577, "energy_consumption_pj": 114}, {"state": "VIC", "financial_year": "2010-11", "energy_production_gwh": 58399, "energy_consumption_pj": 1456}]
  
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  const svg = d3.select("#chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      // List of groups (here I have one group per column)
      const allGroup = new Set(data.map(d => d.state))
  
      // add the options to the button
      d3.select("#stateButtons")
        .selectAll('myOptions')
           .data(allGroup)
        .enter()
          .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
      // A color scale: one color for each group
      const myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);
  
      // Add X axis --> it is a date format
      const x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year_id; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(7));
  
      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.energy_consumption_pj; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // Initialize line with first group of the list
      const line = svg
        .append('g')
        .append("path")
          .datum(data.filter(function(d){return d.state=="VIC"}))
          .attr("d", d3.line()
            .x(function(d) { return x(d.year_id) })
            .y(function(d) { return y(+d.d.energy_consumption_pj) })
          )
          .attr("stroke", function(d){ return myColor("valueA") })
          .style("stroke-width", 4)
          .style("fill", "none")
  
      // A function that update the chart
      function update(selectedGroup) {
  
        // Create new data with the selection?
        const dataFilter = data.filter(function(d){return d.state==selectedGroup})
  
        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(d.year_id) })
              .y(function(d) { return y(+d.d.energy_consumption_pj) })
            )
            .attr("stroke", function(d){ return myColor(selectedGroup) })
      }
  
      // When the button is changed, run the updateChart function
      d3.select("#stateButtons").on("change", function(event,d) {
          // recover the option that has been chosen
          const selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          update(selectedOption)
      })
  